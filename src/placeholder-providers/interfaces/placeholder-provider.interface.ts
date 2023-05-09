export interface IPlaceholderProvider {
    provideValue(): string | Promise<string>;
}
