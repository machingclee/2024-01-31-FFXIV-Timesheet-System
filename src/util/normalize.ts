import { normalize as normalize_, schema } from "normalizr";

export default function normalize<T, IDType = string>({
    targetArr,
    idAttribute,
}: {
    targetArr: T[];
    idAttribute: string;
}) {
    const objectEntity = new schema.Entity<Selection>("object", undefined, {
        idAttribute,
    });
    const normalized = normalize_(targetArr, [objectEntity]);
    const idToObject = normalized.entities["object"] as { [id: string]: T };
    const ids = normalized["result"] as IDType[];
    return { ids, idToObject };
}