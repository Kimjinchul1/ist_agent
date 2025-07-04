from collections.abc import AsyncIterator
from dataclasses import dataclass
from os import getenv
from typing import Any, Dict, Iterator, List, Optional, Type, Union

import httpx
from pydantic import BaseModel

from agno.exceptions import ModelProviderError
from agno.media import AudioResponse
from agno.models.base import Model
from agno.models.message import Message
from agno.models.response import ModelResponse
from agno.utils.log import log_debug, log_error, log_warning
from agno.utils.openai import _format_file_for_message, audio_to_message, images_to_message

try:
    from openai import APIConnectionError, APIStatusError, RateLimitError
    from openai import AsyncOpenAI as AsyncOpenAIClient
    from openai import OpenAI as OpenAIClient
    from openai.types.chat import ChatCompletionAudio
    from openai.types.chat.chat_completion import ChatCompletion
    from openai.types.chat.chat_completion_chunk import (
        ChatCompletionChunk,
        ChoiceDelta,
        ChoiceDeltaToolCall,
    )
except (ImportError, ModuleNotFoundError):
    raise ImportError("`openai` not installed. Please install using `pip install openai`")


@dataclass
class Custom(Model):
    """
    A custom class for interacting with OpenAI-compatible models using special headers.
    
    This model uses custom headers for authentication and identification:
    - X-Dep-Ticket: API key authentication
    - Send-System-Name: System identifier
    - User-Type: User type identifier
    - User-Id: User identifier
    """

    id: str = "gpt-4o"
    name: str = "Custom"
    provider: str = "Custom"
    supports_native_structured_outputs: bool = True

    # Request parameters
    store: Optional[bool] = None
    reasoning_effort: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    frequency_penalty: Optional[float] = None
    logit_bias: Optional[Any] = None
    logprobs: Optional[bool] = None
    top_logprobs: Optional[int] = None
    max_tokens: Optional[int] = None
    max_completion_tokens: Optional[int] = None
    modalities: Optional[List[str]] = None
    audio: Optional[Dict[str, Any]] = None
    presence_penalty: Optional[float] = None
    seed: Optional[int] = None
    stop: Optional[Union[str, List[str]]] = None
    temperature: Optional[float] = None
    user: Optional[str] = None
    top_p: Optional[float] = None
    extra_headers: Optional[Any] = None
    extra_query: Optional[Any] = None
    request_params: Optional[Dict[str, Any]] = None
    role_map: Optional[Dict[str, str]] = None

    # Client parameters
    api_key: Optional[str] = None
    organization: Optional[str] = None
    base_url: Optional[Union[str, httpx.URL]] = None
    timeout: Optional[float] = None
    max_retries: Optional[int] = None
    default_headers: Optional[Any] = None
    default_query: Optional[Any] = None
    http_client: Optional[httpx.Client] = None
    client_params: Optional[Dict[str, Any]] = None

    # Custom header parameters
    system_name: str = "DS_MMLU"
    user_type: str = "jinpro95.kim"
    user_id: str = "AD_ID"

    # The role to map the message role to.
    default_role_map = {
        "system": "developer",
        "user": "user",
        "assistant": "assistant",
        "tool": "tool",
        "model": "assistant",
    }

    def _get_custom_headers(self) -> Dict[str, str]:
        """
        Get custom headers for the API requests.
        
        Returns:
            Dict[str, str]: Custom headers including authentication and identification.
        """
        # Fetch API key from env if not already set
        if not self.api_key:
            self.api_key = getenv("CUSTOM_API_KEY")
            if not self.api_key:
                log_error("CUSTOM_API_KEY not set. Please set the CUSTOM_API_KEY environment variable.")

        return {
            'Content-Type': 'application/json',
            'X-Dep-Ticket': self.api_key or "",
            'Send-System-Name': self.system_name,
            'User-Type': self.user_type,
            'User-Id': self.user_id
        }

    def _get_client_params(self) -> Dict[str, Any]:
        """
        Get client parameters with custom headers.
        
        Returns:
            Dict[str, Any]: Client parameters for OpenAI client initialization.
        """
        # Get custom headers
        custom_headers = self._get_custom_headers()
        
        # Merge with existing default headers if any
        if self.default_headers:
            custom_headers.update(self.default_headers)

        # Define base client params
        base_params = {
            "api_key": self.api_key or "dummy-key",  # OpenAI client requires an API key, but we use headers for auth
            "organization": self.organization,
            "base_url": self.base_url,
            "timeout": self.timeout,
            "max_retries": self.max_retries,
            "default_headers": custom_headers,
            "default_query": self.default_query,
        }

        # Create client_params dict with non-None values
        client_params = {k: v for k, v in base_params.items() if v is not None}

        # Add additional client params if provided
        if self.client_params:
            client_params.update(self.client_params)
        
        return client_params

    def get_client(self) -> OpenAIClient:
        """
        Returns an OpenAI client with custom headers.

        Returns:
            OpenAIClient: An instance of the OpenAI client.
        """
        client_params: Dict[str, Any] = self._get_client_params()
        if self.http_client is not None:
            client_params["http_client"] = self.http_client
        return OpenAIClient(**client_params)

    def get_async_client(self) -> AsyncOpenAIClient:
        """
        Returns an asynchronous OpenAI client with custom headers.

        Returns:
            AsyncOpenAIClient: An instance of the asynchronous OpenAI client.
        """
        client_params: Dict[str, Any] = self._get_client_params()
        if self.http_client:
            client_params["http_client"] = self.http_client
        else:
            # Create a new async HTTP client with custom limits
            client_params["http_client"] = httpx.AsyncClient(
                limits=httpx.Limits(max_connections=1000, max_keepalive_connections=100)
            )
        return AsyncOpenAIClient(**client_params)

    def get_request_params(
        self,
        response_format: Optional[Union[Dict, Type[BaseModel]]] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Returns keyword arguments for API requests.

        Returns:
            Dict[str, Any]: A dictionary of keyword arguments for API requests.
        """
        # Define base request parameters
        base_params = {
            "store": self.store,
            "reasoning_effort": self.reasoning_effort,
            "frequency_penalty": self.frequency_penalty,
            "logit_bias": self.logit_bias,
            "logprobs": self.logprobs,
            "top_logprobs": self.top_logprobs,
            "max_tokens": self.max_tokens,
            "max_completion_tokens": self.max_completion_tokens,
            "modalities": self.modalities,
            "audio": self.audio,
            "presence_penalty": self.presence_penalty,
            "seed": self.seed,
            "stop": self.stop,
            "temperature": self.temperature,
            "user": self.user,
            "top_p": self.top_p,
            "extra_headers": self.extra_headers,
            "extra_query": self.extra_query,
            "metadata": self.metadata,
        }

        # Handle response format
        if response_format is not None:
            if isinstance(response_format, type) and issubclass(response_format, BaseModel):
                from agno.utils.models.schema_utils import get_response_schema_for_provider
                schema = get_response_schema_for_provider(response_format, "openai")
                base_params["response_format"] = {
                    "type": "json_schema",
                    "json_schema": {
                        "name": response_format.__name__,
                        "schema": schema,
                        "strict": True,
                    },
                }
            else:
                base_params["response_format"] = response_format

        # Filter out None values
        request_params = {k: v for k, v in base_params.items() if v is not None}

        # Add tools
        if tools is not None and len(tools) > 0:
            request_params["tools"] = tools
            if tool_choice is not None:
                request_params["tool_choice"] = tool_choice

        # Add additional request params if provided
        if self.request_params:
            request_params.update(self.request_params)

        if request_params:
            log_debug(f"Calling {self.provider} with request parameters: {request_params}")
        return request_params

    def _format_message(self, message: Message) -> Dict[str, Any]:
        """
        Format a message into the format expected by OpenAI.

        Args:
            message (Message): The message to format.

        Returns:
            Dict[str, Any]: The formatted message.
        """
        message_dict: Dict[str, Any] = {
            "role": self.role_map[message.role] if self.role_map else self.default_role_map[message.role],
            "content": message.content,
            "name": message.name,
            "tool_call_id": message.tool_call_id,
            "tool_calls": message.tool_calls,
        }
        message_dict = {k: v for k, v in message_dict.items() if v is not None}

        # Handle multimodal content
        if (message.images is not None and len(message.images) > 0) or (
            message.audio is not None and len(message.audio) > 0
        ):
            if isinstance(message.content, str):
                message_dict["content"] = [{"type": "text", "text": message.content}]
                if message.images is not None:
                    message_dict["content"].extend(images_to_message(images=message.images))
                if message.audio is not None:
                    message_dict["content"].extend(audio_to_message(audio=message.audio))

        # Handle files
        if message.files is not None:
            content = message_dict.get("content")
            if isinstance(content, str):
                message_dict["content"] = [{"type": "text", "text": content}]
            elif content is None:
                message_dict["content"] = []
            for file in message.files:
                file_part = _format_file_for_message(file)
                if file_part:
                    message_dict["content"].insert(0, file_part)

        # Manually add the content field even if it is None
        if message.content is None:
            message_dict["content"] = ""
        return message_dict

    def invoke(
        self,
        messages: List[Message],
        response_format: Optional[Union[Dict, Type[BaseModel]]] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
    ) -> ChatCompletion:
        """
        Send a chat completion request to the Custom API.
        """
        try:
            return self.get_client().chat.completions.create(
                model=self.id,
                messages=[self._format_message(m) for m in messages],  # type: ignore
                **self.get_request_params(response_format=response_format, tools=tools, tool_choice=tool_choice),
            )
        except Exception as e:
            log_error(f"Error from Custom API: {e}")
            raise ModelProviderError(message=str(e), model_name=self.name, model_id=self.id) from e

    async def ainvoke(
        self,
        messages: List[Message],
        response_format: Optional[Union[Dict, Type[BaseModel]]] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
    ) -> ChatCompletion:
        """
        Sends an asynchronous chat completion request to the Custom API.
        """
        try:
            return await self.get_async_client().chat.completions.create(
                model=self.id,
                messages=[self._format_message(m) for m in messages],  # type: ignore
                **self.get_request_params(response_format=response_format, tools=tools, tool_choice=tool_choice),
            )
        except Exception as e:
            log_error(f"Error from Custom API: {e}")
            raise ModelProviderError(message=str(e), model_name=self.name, model_id=self.id) from e

    def invoke_stream(
        self,
        messages: List[Message],
        response_format: Optional[Union[Dict, Type[BaseModel]]] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
    ) -> Iterator[ChatCompletionChunk]:
        """
        Send a streaming chat completion request to the Custom API.
        """
        try:
            yield from self.get_client().chat.completions.create(
                model=self.id,
                messages=[self._format_message(m) for m in messages],  # type: ignore
                stream=True,
                stream_options={"include_usage": True},
                **self.get_request_params(response_format=response_format, tools=tools, tool_choice=tool_choice),
            )  # type: ignore
        except Exception as e:
            log_error(f"Error from Custom API streaming: {e}")
            raise ModelProviderError(message=str(e), model_name=self.name, model_id=self.id) from e

    async def ainvoke_stream(
        self,
        messages: List[Message],
        response_format: Optional[Union[Dict, Type[BaseModel]]] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        tool_choice: Optional[Union[str, Dict[str, Any]]] = None,
    ) -> AsyncIterator[ChatCompletionChunk]:
        """
        Sends an asynchronous streaming chat completion request to the Custom API.
        """
        try:
            async_stream = await self.get_async_client().chat.completions.create(
                model=self.id,
                messages=[self._format_message(m) for m in messages],  # type: ignore
                stream=True,
                stream_options={"include_usage": True},
                **self.get_request_params(response_format=response_format, tools=tools, tool_choice=tool_choice),
            )
            async for chunk in async_stream:
                yield chunk
        except Exception as e:
            log_error(f"Error from Custom API async streaming: {e}")
            raise ModelProviderError(message=str(e), model_name=self.name, model_id=self.id) from e

    def parse_provider_response_delta(self, response_delta: ChatCompletionChunk) -> ModelResponse:
        """
        Parse the Custom API streaming response into a ModelResponse.
        """
        model_response = ModelResponse()
        if response_delta.choices and len(response_delta.choices) > 0:
            choice_delta: ChoiceDelta = response_delta.choices[0].delta

            if choice_delta:
                # Add content
                if choice_delta.content is not None:
                    model_response.content = choice_delta.content

                # Add tool calls
                if choice_delta.tool_calls is not None:
                    model_response.tool_calls = choice_delta.tool_calls  # type: ignore

        # Add usage metrics if present
        if response_delta.usage is not None:
            model_response.response_usage = response_delta.usage

        return model_response

    def parse_provider_response(
        self,
        response: ChatCompletion,
        response_format: Optional[Union[Dict, Type[BaseModel]]] = None,
    ) -> ModelResponse:
        """
        Parse the Custom API response into a ModelResponse.
        """
        model_response = ModelResponse()

        # Get response message
        response_message = response.choices[0].message

        # Add role
        if response_message.role is not None:
            model_response.role = response_message.role

        # Add content
        if response_message.content is not None:
            model_response.content = response_message.content

        # Add tool calls
        if response_message.tool_calls is not None and len(response_message.tool_calls) > 0:
            try:
                model_response.tool_calls = [t.model_dump() for t in response_message.tool_calls]
            except Exception as e:
                log_warning(f"Error processing tool calls: {e}")

        if response.usage is not None:
            model_response.response_usage = response.usage

        return model_response 