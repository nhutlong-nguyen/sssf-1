//added: basic message response structure with a single string message
type MessageResponse = {
  message: string;
};

//added: Extends MessageResponse type with an optional stack property
//for error details
type ErrorResponse = MessageResponse & {
  stack?: string;
};

//added: Extends MessageResponse type with a mandatory id property for upload responses
type UploadResponse = MessageResponse & {
  id: number;
};

export {MessageResponse, ErrorResponse, UploadResponse};
