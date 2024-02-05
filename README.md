# 可拖拽排序视系图

示例：

![1706782115426](images/README/1706782115426.png)

使用简洁，示例如下：

```
<HierarchyView
  options={options}
  levelNames={[]}
  disEdit={disEdit}
  onSave={
    disEdit
    ? undefined
    : (nodes, levelNames) => {
       }
    }
/>
```

参数：


| 参数       | 说明                                                                                                                            | 备注       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| options    | {rowId: string, children:string[],title:string,pid:string,pathId:string[]}[]<br />带有层级关系的一维数组。是所有节点信息的集合 | 详情看下表 |
| levelNames | string[]<br />一个字符串数组。表示每个层级的自定义name。初始化为空，自行构造name.                                               |            |
| disEdit    | bool<br />是否禁止编辑。通常是指预览模式                                                                                        |            |
| onSave     | function<br />保存回调函数。将获得2个值(nodes,levelNames) 分别为节点数组和层级name数组                                          |            |

options参数说明：


| 参数  | 说明                     | 类型   |
| ----- | ------------------------ | ------ |
| rowId | 表示每个节点的唯一标识。 | string |
| children | 该节点的所有直系子节点的rowId。 | string[] |
| title | 该节点的展示的label。 | string |
| pid | 如果该节点有父节点，那么则表示其父节点的rowId。 | string |
| pathId | 表示该节点的关联路径，例如[根，祖，父，己]的节点rowId集合。 | string[] |

