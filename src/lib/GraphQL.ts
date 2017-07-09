export class GraphQLEntityOptions<Arguments> {
    args: Arguments;
    constructor(public options?: { name?: string }) {

    }
}

interface Class<T, Arguments> {
    new(...args: any[]): T;
    gql?: GraphQLEntityOptions<Arguments>
    // gqlArguments?: Arguments;
}

export function selectFields<Entity extends Given, Given>(Class: Class<Entity, {}>, obj: Given): Given {
    obj.constructor = Class;
    return obj;
}

export function validateArgs<Arguments extends GivenArguments, Entity, GivenArguments>(Class: Class<Entity, Arguments>, args: GivenArguments): {};
export function validateArgs<Entity extends Given, Given, Arguments extends GivenArguments, GivenArguments>(Class: Class<Entity, Arguments>, args: GivenArguments, obj?: Given): Given {
    var o = obj as any;
    if (!o) {
        o = {};
    }
    o.__args = args;
    return o;
}

export function buildGraphQLQuery(scheme: any, args?: any) {
    if (scheme instanceof Array) {
        scheme = scheme[0];
    }
    const keys = Object.keys(scheme);
    const argKeys = args !== void 0 ? Object.keys(args.__args) : [];
    var Class:Class<{}, {}> | undefined = scheme.constructor;
    if (Class === Object) Class = void 0;
    var gql: GraphQLEntityOptions<{}> | undefined = (Class && Class.gql) ? Class.gql : void 0;
    let s = '';

    if (Class) {
        s += ':' + (gql && gql.options && gql.options.name || Class.name);
    }
    if (argKeys.length > 0) {
        s += '(';
    }
    for (let i = 0; i < argKeys.length; i++) {
        const key = argKeys[i];
        const value = args.__args[key];
        s += (i !== 0 ? ',' : '') + key + ':' + JSON.stringify(value);
    }
    if (argKeys.length > 0) {
        s += ')';
    }
    s += '{'
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === 'constructor') continue;
        let value = (scheme as any)[key];
        if (typeof value === 'object' && value !== null) {
            value = buildGraphQLQuery(value, args ? args[key] : void 0);
        } else {
            value = '';
        }
        s += (i !== 0 ? ',' : '') + key + (value === '' ? '' : value);
    }
    s += '}';
    return s;
}

