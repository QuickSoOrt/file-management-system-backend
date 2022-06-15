export class GetFileContentUseCaseResponse {
  content: Buffer;

  constructor(content) {
    this.content = content;
  }
}
