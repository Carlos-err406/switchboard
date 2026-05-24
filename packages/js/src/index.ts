export class Switchboard {
  constructor(_opts: { url: string; apiKey: string; env: string }) {
    throw new Error('@switchboard/js is not yet implemented')
  }

  async ready(): Promise<void> {
    throw new Error('@switchboard/js is not yet implemented')
  }

  get(_name: string): boolean {
    throw new Error('@switchboard/js is not yet implemented')
  }

  on(_name: string, _cb: (value: boolean) => void): () => void {
    throw new Error('@switchboard/js is not yet implemented')
  }
}
