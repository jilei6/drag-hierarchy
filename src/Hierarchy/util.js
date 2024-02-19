import _ from "lodash";
export const getPosition = ($parent, $cur, scale = 1) => {
    if (!$parent || !$cur) return {};
    const { top, bottom, height } = $parent.getBoundingClientRect();
    const { top: curTop, bottom: curBottom, height: curHeight } = $cur.getBoundingClientRect();
    // svg元素的高度
    const svgHeight = Math.max(bottom - top, curBottom - top, curBottom - curTop, bottom - curTop) / scale;
    // svg向上位移的像素值
    const svgTop = curTop - top;
    // 曲线起点坐标, -10 是为了抵消marginBottom值
    const startY = (height - 8) / 2 / scale;
    const startPoint = [28, startY];
    // 曲线终点坐标
    const endY = ((curHeight - 8) / 2 + svgTop) / scale;

    const endPoint = [120, endY];
    return {
        height: svgHeight,
        top: svgTop / scale,
        start: startPoint,
        end: endPoint,
    };
};

const safeLocalStorageSetItem = (...args) => {
    try {
        window.localStorage.setItem(...args);
    } catch (err) {
        console.log(err);
    }
};

export const dropItem = key => localStorage.removeItem(key);
export const setItem = (key, value) => safeLocalStorageSetItem(key, JSON.stringify(value));
export const getItem = key => JSON.parse(localStorage.getItem(key));
// 判断标题控件是否是文本控件
export const isTextTitle = (controls = []) => _.findIndex(controls, item => item.attribute === 1 && item.type === 2) > -1;

// 获取完整路径
export const dealPath = path => {
    const wholePath = path.reduce((p, c) => p.concat([c, "children"]), []);
    wholePath.pop();
    return wholePath;
};
export const dealData = data => {
    const res = {};
    data.forEach(item => {
        res[item.rowid] = item;
    });
    return res;
};

export function getItemByRowId(rowId = null, data = []) {
    if (rowId) {
        const treeFind = tree => {
            for (const item of tree) {
                if (item.rowId === rowId) return item;
                if (item.children && item.children.length > 0) {
                    const res = treeFind(item.children);
                    if (res) return res;
                }
            }
            return null;
        };
        return treeFind(data);
    }
}
// 处理children为数组形式
export const dealChildren = children => {
    if (!children) return [];
    if (Array.isArray(children)) return children;
    if (typeof children === "string") {
        try {
            return JSON.parse(children);
        } catch (error) {
            console.log(error);
        }
    }
    return [];
};

const findParentNodes = (data, rowId, parentId, parentNodes = [], path = []) => {
    if (!parentId) return [parentNodes, path];
    const parentNode = data.find(v => v.key === parentId);
    parentNodes.push(parentNode);
    const itemIndex = parentNode.childKeys.findIndex(v => v === rowId);
    if (itemIndex > -1) {
        path.unshift(itemIndex);
    }
    if (parentNode?.parentKey) {
        return findParentNodes(data, parentNode.key, parentNode?.parentKey, parentNodes, path);
    } else {
        return [parentNodes, path];
    }
};
const showVisible = path => {
    const config = getItem(`hierarchyConfig`) || {};
    if (config?.level === -1) {
        return true;
    } else {
        if (path.length >= config?.level - 1) {
            return false;
        } else {
            return true;
        }
    }
};
// 初始化状态树
export const initNodes = ({ data, visible = true }) => {
    if (!data || !_.isArray(data) || _.isEmpty(data)) return [];
    return data.map((item, index) => {
        const pathIds = [];
        const [parentNodes, path] = findParentNodes(data, item?.key, item?.parentKey, [], []);
        parentNodes.map(v => {
            pathIds.push(v?.key);
        });

        const c_path = path.length === 0 ? [0] : [0].concat(path);
        const visible = showVisible(path);
        return {
            rowId: item.key,
            visible: visible,
            display: true,
            path: c_path,
            pathId: pathIds.concat(item.key),
            children: item?.childKeys || [],
            title: item?.value || "",
            pid: item?.parentKey,
        };
    });
};

// 判断是否是祖先元素
export const isAncestor = (src, target) => {
    for (let i = 0; i < target.length; i++) {
        if (src[i] !== target[i]) return false;
    }
    return true;
};

// 判断是否是后代元素
export const isOffspring = (src, target) => {
    for (let i = 0; i < src.length; i++) {
        if (src[i] !== target[i] && target.length > src.length) return true;
    }
    return false;
};
export const isSibling = (src, target) => {
    if (!Array.isArray(src) || !Array.isArray(target)) return;
    return JSON.stringify(src.slice(0, -1)) === JSON.stringify(target.slice(0, -1));
};


