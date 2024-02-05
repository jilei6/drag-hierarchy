import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import _ from "lodash";
import ToolBar from "./ToolBar";
import { getItem, initNodes } from "./util";
import TreeNode from "./components/TreeNode";
import LeftBoundary from "./components/LeftBoundary";
import LayerTitle from "./components/LayerTitle";
import { v4 as uuidv4 } from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";
import EmptyHierarchy from "./EmptyHierarchy";
import { useSetState } from "react-use";
import DragLayer from "./components/DragLayer";

const RecordStructureWrap = styled.div`
  padding-left: 48px;
  height: 100%;
  // overflow: auto;
  overflow-x: auto;
  ::-webkit-scrollbar-x {
    height: 8px;
  }
`;

const SortableTreeWrap = styled.div`
  position: relative;
  transform-origin: left top;
  transform: ${(props) =>
    props.scale ? `scale(${props.scale / 100})` : "scale(1)"};
  .nodeWrap {
    position: relative;
    display: flex;
    align-items: flex-start;
    canvas.nodeItemCanvas {
      position: absolute;
      top: 50%;
      left: -120px;
      width: 120px;
    }
  }
  .childNodeWrap {
    transform: translateX(120px);
  }
`;

function Hierarchy(props) {
  const { isCharge, onSave, options, disEdit, ToolBarDiv, ...rest } = props;
  const { scale: configScale, level: configLevel = -1 } =
    getItem(`hierarchyConfig`) || {};
  const [nodes, setNodes] = useState([]);
  const [levelNames, setLevelNames] = useState([]);
  const [saveDisabled, setSaveDisabled] = useState(true);

  const [{ level, scale, addRecordPath }, setState] = useSetState({
    scale: configScale || 100,
    level: configLevel,
    addRecordDefaultValue: "",
    createRecordVisible: false,
    addRecordPath: {},
  });
  const $wrapRef = useRef(null);
  useEffect(() => {
    const c_nodes = initNodes({ data: options });
    setNodes(c_nodes);
  }, []);
  const handleToolClick = (type, obj) => {
    if (type === "genScreenshot") {
      // genScreenshot();
    }
    if (type === "toOrigin") {
      const $wrap = _.get(this.$wrap, "current");
      $wrap.scrollLeft = 0;
      $wrap.scrollTop = 0;
    }
    if (type === "adjustScale") {
      setState({ scale: obj.scale });
    }
  };

  const toggleChildren = ({ rowId, visible, ...rest }, isResetLevel) => {
    const targetNode = nodes.find((v) => v?.rowId === rowId);
    targetNode.visible = visible;
    setNodes(nodes.slice());
    if (isResetLevel) {
      setState({ level: -1 });
    }
  };

  const createTextTitleTempRecord = ({
    pathId,
    visible,
    pid,
    path,
    ...rest
  }) => {
    const rowId = uuidv4();
    // 记录不是顶级且子级没有展开则先展开子级
    if (pathId.length > 0) {
      const node = { pathId: pathId.concat(rowId), rowId, pid, ...rest };

      const parentNode = nodes.find((v) => v.rowId === pid);
      if (parentNode) {
        const childs = parentNode?.children || [];
        childs.push(rowId);
        parentNode.children = childs;
        node.path = [...(parentNode?.path || []), parentNode?.children?.length];
      } else {
        node.path = [0];
      }

      const tempNodes = nodes.concat([node]);
      setNodes(tempNodes);
    } else {
      console.log("nodes", nodes);
      const node = {
        pathId: pathId.concat(rowId),
        rowId,
        pid,
        path: [0],
        ...rest,
      };
      const tempNodes = nodes.concat([node]);
      setNodes(tempNodes);
    }
  };

  const handleAddRecord = (obj) => {
    const { isTextTitle, value = "", pid, visible, ...rest } = obj;
    if (isTextTitle) {
      createTextTitleTempRecord({ ...rest, visible, pid });
      setSaveDisabled(false);
    }
  };
  const removeHierarchyTempItem = ({ rowId, path, pid }) => {
    const parentNode = nodes.find((v) => v?.rowId === pid);
    if (parentNode) {
      parentNode.children = parentNode.children?.filter((v) => v !== rowId);
      parentNode.childKeys = parentNode.childKeys?.filter((v) => v !== rowId);
    }

    setNodes(nodes.filter((v) => v.rowId !== rowId).slice());
  };
  const scrollToBottom = () => {
    const $dom = _.get($wrapRef, "current");
    if (!$dom) return;

    // 底部空间不够才滚动到底部
    if ($dom.scrollHeight - $dom.scrollTop < 100) {
      $dom.scrollTop = $dom.scrollHeight;
    }
  };
  const createTextTitleRecord = (value, spliceTempRecord = false, rowId) => {
    const nodeItem = nodes?.find((v) => v?.rowId === rowId); //[data.rowId];
    nodeItem.type = "";
    nodeItem.title = value;
    setNodes(nodes.slice());
  };

  // 获取层级数
  const getLayerCount = (arr) => {
    if (!arr.length) return 0;
    const len = arr.map((item) => {
      if (typeof item === "string") return 0;
      if (_.every(item.children, (item) => typeof item === "string"))
        return item.path.length;
      if (item.visible !== "undefined" && !item.visible)
        return item.path.length;
      return item.children.length
        ? getLayerCount(item.children)
        : item.path.length;
    });
    return len;
  };

  const getLayerLength = () => {
    return _.max(_.flattenDeep(getLayerCount(nodes))) || 1;
  };

  const initLayerTitle = () => {
    return _.fill(Array.from({ length: getLayerLength() }), "");
  };

  // 展开多级
  const showLevelData = (obj) => {
    setState({ level: obj.layer });
    const c_nodes = nodes.map((v) => {
      if (v.path?.length >= obj.layer) {
        v.visible = false;
      } else {
        v.visible = true;
      }
      return v;
    });
    setNodes(c_nodes);
  };

  const sortChildren = (arr, srcRowId, targetRowId) => {
    // 找到要移动的元素的索引位置
    const moveIndex = arr.indexOf(srcRowId);
    // 找到要移动到的元素的索引位置
    const targetIndex = arr.indexOf(targetRowId);

    if (moveIndex > -1 && targetIndex > -1) {
      // 先使用 splice() 方法删除要移动的元素
      const [movedItem] = arr.splice(moveIndex, 1);
      // 再使用 splice() 方法将要移动的元素插入到目标元素的前面
      arr.splice(targetIndex, 0, movedItem);
    }
    return arr;
  };
  const updateMovedRecord = (args) => {
    const { src, target, ...rest } = args;
    if (src.path.length === 1) {
      const targetNode = nodes.find((v) => v?.rowId === target?.rowId);
      const srcNode = nodes.find((v) => v?.rowId === src?.rowId);
      if (!targetNode?.children) {
        targetNode.children = [];
      }
      targetNode.children.push(src.rowId);
      srcNode.path = [
        ...(targetNode?.path || []),
        targetNode?.children?.length,
      ];
      srcNode.pathId = targetNode?.pathId.concat(src.rowId);
      srcNode.pid = targetNode.rowId;
      setNodes(nodes.slice());
    } else {
      const targetNode = nodes.find((v) => v?.rowId === target?.rowId);
      const parentNode = nodes.find((v) => v?.rowId === src?.pid);
      const srcNode = nodes.find((v) => v?.rowId === src?.rowId);
      if (parentNode) {
        parentNode.children = parentNode.children?.filter(
          (v) => v !== src.rowId
        );
      }
      if (!targetNode?.children) {
        targetNode.children = [];
      }
      targetNode.children.push(src.rowId);
      srcNode.path = [
        ...(targetNode?.path || []),
        targetNode?.children?.length,
      ];
      srcNode.pathId = targetNode?.pathId.concat(src.rowId);
      srcNode.pid = targetNode.rowId;
      setNodes(nodes.slice());
    }
    setSaveDisabled(false);
    // 如果是拖到兄弟元素上则只需要拉取父级元素
    // if (isSibling(src.path, target.path)) {
    // }
    // // 如果拖动祖先元素中 则只拉取祖先元素的数据即可
    // if (isAncestor(src.path, target.path)) {
    // }
    // if (isOffspring(src.path, target.path)) {
    // }
  };
  const renderContent = () => {
    const renderHierarchy = () => {
      return (
        <Fragment>
          {nodes.length > 0 && (
            <LayerTitle
              scale={scale}
              layerLength={getLayerLength()}
              allowEdit={!disEdit}
              layersName={
                _.isEmpty(levelNames)
                  ? initLayerTitle()
                  : levelNames?.map((v) => v?.name)
              }
              updateLayersName={(names) =>
                setLevelNames(
                  names?.map((v, index) => {
                    return {
                      name: v,
                      level: index,
                    };
                  })
                )
              }
            />
          )}
          <SortableTreeWrap scale={scale}>
            {_.isEmpty(nodes) ? (
              <EmptyHierarchy
                layersName={levelNames?.map((v) => v?.name)}
                updateLayersName={(names) =>
                  setLevelNames(
                    names?.map((v, index) => {
                      return {
                        name: v,
                        level: index,
                      };
                    })
                  )
                }
                allowAdd={!disEdit}
                onAdd={(value) =>
                  handleAddRecord({
                    isTextTitle: true,
                    type: "textTitle",
                    path: [],
                    pathId: [],
                    title: value,
                  })
                }
              />
            ) : (
              nodes.map((item, index) => {
                return item.pid ? null : (
                  <TreeNode
                    {...rest}
                    key={item.pathId.join("-")}
                    index={index}
                    data={item}
                    scale={scale / 100}
                    depth={0}
                    isCharge={isCharge}
                    level={level}
                    treeData={nodes}
                    removeHierarchyTempItem={removeHierarchyTempItem}
                    handleAddRecord={handleAddRecord}
                    toggleChildren={toggleChildren}
                    allowAdd={!disEdit}
                    createTextTitleRecord={createTextTitleRecord}
                    updateMovedRecord={updateMovedRecord}
                    onDelete={(rowId) => {
                      const delNode = nodes.find((v) => v.rowId === rowId);
                      if (delNode) {
                        const parentNode = nodes.find(
                          (v) => v.rowId === delNode.pid
                        );
                        if (parentNode) {
                          const index = parentNode.children.indexOf(rowId);
                          if (index > -1) {
                            // 使用 splice() 方法删除找到的元素及其之后的所有元素
                            parentNode.children.splice(index, 1);
                          }
                        }
                      }
                      const c_nodes = nodes?.filter(
                        (v) => v?.rowId !== rowId && !v?.pathId.includes(rowId)
                      ); //[data.rowId];
                      setNodes(c_nodes);
                      setSaveDisabled(false);
                    }}
                    updateTitleData={(value, rowId) => {
                      const nodeItem = nodes?.find((v) => v?.rowId === rowId); //[data.rowId];
                      nodeItem.type = "";
                      nodeItem.title = value;
                      setNodes(nodes.slice());
                      setSaveDisabled(false);
                    }}
                  />
                );
              })
            )}
          </SortableTreeWrap>
        </Fragment>
      );
    };

    return (
      <RecordStructureWrap
        className="hierarchyViewWrap scl"
        ref={$wrapRef}
        style={{}}
      >
        {renderHierarchy()}
      </RecordStructureWrap>
    );
  };
  return (
    <div className="structureViewWrap">
      {!disEdit && (
        <LeftBoundary
          showAdd={true}
          onClick={() =>
            handleAddRecord({
              isTextTitle: true,
              path: [],
              pathId: [],
              type: "textTitle",
            })
          }
        />
      )}
      <DragLayer scale={scale} treeData={nodes} isCharge={isCharge} />
      {!_.isEmpty(nodes.filter((v) => v?.type !== "textTitle")) && (
        <ToolBar
          scale={scale}
          level={level}
          onClick={handleToolClick}
          saveDisabled={saveDisabled}
          showLevelData={showLevelData}
          onSave={
            onSave
              ? () => {
                  setSaveDisabled(true);
                  onSave(nodes, levelNames);
                }
              : null
          }
        />
      )}
      {renderContent()}
    </div>
  );
}

export default function HierarchyView(props) {
  return (
    <DndProvider context={window} backend={HTML5Backend}>
      <Hierarchy {...props} />
    </DndProvider>
  );
}
