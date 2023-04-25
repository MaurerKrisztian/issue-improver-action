"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTemplate = void 0;
function resolveTemplate(template, context) {
    const usedOption = {
        removeNotFounded: true,
    };
    return template.replace(/{{([^}]+)}}/g, (match, prop) => {
        var _a;
        return (_a = context[prop]) !== null && _a !== void 0 ? _a : (usedOption.removeNotFounded ? '' : `${match}`);
    });
}
exports.resolveTemplate = resolveTemplate;
//# sourceMappingURL=utils.js.map