/*
export async function scanExecutableFile(source: string, path: string) {
    let imports = null;
    let langs = null;

    const importsMap = new Map();
    const modules = [];

    while((imports = BMC_DETECT_IMPORT.exec(source)) !== null) {
        importsMap.set(imports[1], join(dirname(path), imports[2]));
    }

    while((langs = BMC_DETECT_DICT.exec(source)) !== null) {
        let modulePath = importsMap.get(langs[1]);

        if(modulePath != null) {
            if(!await stat(modulePath)) {
                if(await stat(modulePath + ".ts")) {
                    modulePath += ".ts";
                } else if(await stat(modulePath + ".tsx")) {
                    modulePath += ".tsx";
                } else if(await stat(modulePath + ".js")) {
                    modulePath += ".js";
                } else if(await stat(modulePath + ".jsx")) {
                    modulePath += ".jsx";
                }
            }

            modules.push({
                path: modulePath,
                name: langs[1],
                ext: extname(modulePath),
                dir: basename(modulePath),
                exists: await stat(modulePath),
                module: await fs.readFile(modulePath)
            });
        }
    }

    return modules;
}
*/