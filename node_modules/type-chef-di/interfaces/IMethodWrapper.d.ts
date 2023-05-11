export interface IMethodWrapper {
    run(next: Function, params: any[]): any;
}
