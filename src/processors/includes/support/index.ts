import { Pair, Scalar, YAMLMap } from "yaml/types";

export function findInYamlMap(map: YAMLMap, property: string) {
    const items = map.items;

    for(const current of items) {
        const key = current.key;
        
        if(current.key.value === property) {
            return current;
        }
    }

    return null;
}

export function putInYamlMap(map: YAMLMap, property: string, value: any) {
    map.add(new Pair(
        new Scalar(property),
        value
    ));
}