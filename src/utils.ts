export function resolveTemplate(template: string, context: Record<string, string>) {
    const usedOption = {
        removeNotFounded: true,
    }
    return template.replace(/{{([^}]+)}}/g, (match, prop) => {
        return context[prop] ?? (usedOption.removeNotFounded ? '' : `${match}`);
    });
}
