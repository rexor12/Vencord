import definePlugin from "@utils/types";

export default definePlugin({
    name: "Disable Command Auto-complete",
    description: "Disables the command auto-complete popup for prefixes.",
    authors: [
        {
            id: 401490060156862466n,
            name: "shalanor"
        }
    ],
    patches: [
        {
            find: "return{type:\"prefix\",cleanedQuery:",
            replacement: [{
                match: /var (\i)=\i.exec\(\i\);(if\(null!=\i\)return{type:"prefix",)/,
                replace: "var $1=null;$2"
            }]
        },
    ],
});