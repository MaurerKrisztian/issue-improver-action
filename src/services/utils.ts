export class Utils {
    static resolveTemplate(template: string, context: Record<string, string>) {
        return template.replace(/{{([^}]+)}}/g, (match, prop) => {
            return context[prop] ?? `${match}`;
        });
    }
}
