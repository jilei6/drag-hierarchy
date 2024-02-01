import React, { Component } from "react";
import SortableNode from "./SortableNode";
import CreateRecord from "./createRecord";
import _ from "lodash";

export default class TreeNode extends Component {
    static propTypes = {};
    static defaultProps = {};
    showChildRen = (visible, children, path, level) => {
        if (level === -1) {
            return visible && !_.isEmpty(children);
        } else {
            if (path.length >= level) {
                return false;
            } else {
                return visible && !_.isEmpty(children);
            }
        }
    };
    render() {
        const { data, treeData, depth, level, ...rest } = this.props;
        const { children = [], pathId = [], visible = true, path } = data;
        const nodeItem = treeData?.find(v => v?.rowId === data.rowId); //[data.rowId];
        if (!nodeItem) return null;
        const showChildren = this.showChildRen(visible, children, path, level);
        return (
            <div className="nodeWrap">
                {nodeItem.type === "textTitle" ? (
                    <CreateRecord treeData={treeData} itemData={data} {...this.props} />
                ) : (
                    <SortableNode showChildren={showChildren} {...this.props} />
                )}
                {showChildren && (
                    <div className="childNodeWrap">
                        {children.map((item, index) => {
                            if (!item) return null;
                            const itemData = treeData.find(v => v?.rowId === item); // treeData[typeof item === "string" ? item : item.rowId];
                            if (!itemData) return null;
                            if (itemData.type === "textTitle") {
                                return <CreateRecord key={item?.rowId} {...this.props} index={index} treeData={treeData} itemData={itemData} />;
                            }
                            return (
                                <TreeNode
                                    key={item.rowId}
                                    depth={depth + 1}
                                    pid={pathId.join("-")}
                                    data={itemData}
                                    treeData={treeData}
                                    level={level}
                                    {...rest}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }
}
