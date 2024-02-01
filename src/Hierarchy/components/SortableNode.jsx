import React, { Fragment, Component, createRef } from "react";
import { string, number, func } from "prop-types";
import cx from "classnames";
import _, { isEmpty } from "lodash";
import { getItem, getPosition } from "../util";
import SVG from "svg.js";
import DraggableRecord from "./DraggableRecord";
import $ from "jquery";

export default class SortableRecordItem extends Component {
    static propTypes = {
        index: number,
        parentId: string,
        toggleChildren: func,
        handleAddRecord: func,
    };
    static defaultProps = {
        toggleChildren: _.noop,
        handleAddRecord: _.noop,
    };
    constructor(props) {
        super(props);
        this.$itemWrap = createRef(null);
    }
    componentDidMount() {
        this.drawConnector();
    }

    componentDidUpdate() {
        this.drawConnector();
    }

    getNode = (data, path) => {
        if (!path.length) return {};
        if (path.length === 1) return data[path[0]];
        const cur = path.shift();
        return this.getNode(data[cur].children, path);
    };

    // 获取连接线位置
    getConnectLinePos = ({ stateTree, pid, data, scale }) => {
        const { path = [], rowId } = data;
        const $ele = _.get(this.$itemWrap, ["current"]);
        if ($ele && data?.pid) {
            //  this.getNode(this.props.treeData, path.slice(0, -1));
            const getParent = this.props.treeData.find(v => v.rowId === data?.pid);
            if (!getParent || _.isEmpty(getParent)) return {};
            const childrenCount = (_.get(getParent, "children") || {}).length;
            if (!childrenCount) return {};
            const $parent = $(`#${getParent.pathId.join("-")}`)[0];

            // const $parent = $(`#${getParent.pathId.join("-")}`).find(`#${getParent.pathId.join("-")}`)[0];
            if ($parent === $ele) return {};
            const currentIndex = _.findIndex(getParent.children, item => item === rowId || item.rowId === rowId) || 0;

            /* 为了防止连线过于重叠,处理控制点的横坐标
       靠上的记录的控制点靠右 靠下的记录控制点靠左，最右到父子记录间隔的一半即60px,最左为起点0
       */

            const controlPointX = ((childrenCount - currentIndex) / childrenCount) * 60;
            return { controlPointX, ...getPosition($parent, $ele, scale) };
        }
        return {};
    };

    // 绘制连接线
    drawConnector = () => {
        const { data } = this.props;
        const { pathId } = data;
        const $svgWrap = document.getElementById(`svg-${pathId.join("-")}`);

        const position = this.getConnectLinePos(this.props);

        if (isEmpty(position)) return;

        const { height = 0, top = 0, start = [], end = [], controlPointX } = position;
        $($svgWrap).height(height).css({ top: -top });

        // 获取控制点
        const controlPoint = [controlPointX, end[1]];
        if ($svgWrap.childElementCount > 0) {
            $svgWrap.childNodes.forEach(child => $svgWrap.removeChild(child));
        }
        const draw = SVG(`svg-${pathId.join("-")}`).size("100%", "100%");
        const linePath = ["M", ...start, "Q", ...controlPoint, ...end].join(" ");
        draw.path(linePath).stroke({ width: 2, color: "#d3d3d3" }).fill("none");
    };
    getCurrentSheetRows = () => {
        const { stateTree = [] } = this.props;

        const getLayerRows = (arr = [], rows = []) => {
            const { data = {}, treeData = {} } = this.props;
            if (arr.length) {
                // eslint-disable-next-line array-callback-return
                arr.map(item => {
                    if (_.get(item, "pathId.length") === _.get(data, "pathId.length")) {
                        rows.push({
                            index: (_.get(item, "path") || [])[_.get(item, "pathId.length") - 1],
                            row: treeData[item.rowId],
                        });
                    }
                    if (_.get(item, "children.length")) {
                        getLayerRows(item.children, rows);
                    }
                });
            }
            return rows;
        };
        const newRows = getLayerRows(stateTree);
        return _.sortBy(newRows, "index").map(i => i.row);
    };
    render() {
        const { data } = this.props;
        const { rowId, path = [], pathId = [] } = data;
        const { rowId: draggingId } = getItem("draggingHierarchyItem") || "";
        return (
            <Fragment>
                <div className={cx("sortableTreeNodeWrap", { isDragging: draggingId === rowId })} id={pathId.join("-")} ref={this.$itemWrap}>
                    <div id={`svg-${pathId.join("-")}`} className="svgWrap" />
                    <DraggableRecord {...this.props} />
                </div>
            </Fragment>
        );
    }
}
