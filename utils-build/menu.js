const fs = require("fs");
const path = require("path");

module.exports = {
    get: (pagePath) => {
        if (pagePath.slice(-1) != "/") {
            pagePath += "/";
        }
        let folders = fs.readdirSync(pagePath);
        folders = folders.filter((folder) => {
            const stat = fs.lstatSync(pagePath + folder);
            return !stat.isFile() && /^\d/.test(folder);
        });

        const getChildren = (folder) => {
            const files = fs
                .readdirSync(pagePath + folder)
                .filter((file) => {
                    const stat = fs.lstatSync(pagePath + folder + path.sep + file);
                    return stat.isFile() && /^\d.*mdx?$/.test(file);
                })
                .map((children) => {
                    const filePath = pagePath + folder + path.sep + children
                    const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })

                    const nameWithoutExtension = children.split('.').slice(0, -1).join('.')
                    const readFrontMatterTitle = data.match(/title: (.*)/)
                    const title = (readFrontMatterTitle && readFrontMatterTitle.length)
                        ? readFrontMatterTitle[1]
                        : nameWithoutExtension
                    // console.log("Names", nameWithoutExtension, title)
                    return {
                        link: filePath,
                        name: nameWithoutExtension,
                        title: title,
                    }
                });
            return files
        }

        return folders
            .map((folder) => {
                let link = path.parse(folder).name;
                return {
                    link: link,
                    name: link.split("-").join(" - "),
                    children: getChildren(folder),
                };
            })
            .filter(data => data.children.length)
            ;
    },
};