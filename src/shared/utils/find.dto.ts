import { match, P } from "ts-pattern";
import { IsNull, Not } from "typeorm";
import { BooleanStatus } from "src/configs/database.config";

export const transFomId = (id?: string) => {
    return match(id)
        .with(P.union("null"), () => IsNull)
        .with(P.string, (value) => ({ id: value }))
        .otherwise(() => undefined)
};

export const transformNullableLowercase = (text?: string) => {
    return match(text)
        .with(P.union("null"), () => IsNull())
        .with(P.string, (value) => value.toLowerCase().trim())
        .otherwise(() => undefined)
};

export const transIsInitialized = (status?: string) => {
    return match(status)
        .with(BooleanStatus.True, () => Not(IsNull()))
        .with(BooleanStatus.False, () => IsNull())
        .otherwise(() => undefined)
};

export const transformBoolean = (status?: string) => {
    return match(status)
        .with(P.string, (value) => value === BooleanStatus.True)
        .otherwise(() => undefined);
}