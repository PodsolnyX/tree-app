import {useEffect, useState} from "react";
import Node from "./node/node";

const Tree = (props) => {

    const getTreeCopy = (treeData) => {
        return JSON.parse(JSON.stringify(treeData))
    }

    const [treeData, setTreeData] = useState(getTreeCopy(props.data));
    const [isSelectedMod, setSelectedMod] = useState(false);
    const [isEditMod, setEditMod] = useState(false);
    const [isEmptyNodeLabel, setIsEmptyNodeLabel] = useState(false);
    const [selectedNodeId, selectNodeId] = useState("");

    useEffect(() => {
        function handleOutsideClick(event) {
            if (event.target.className === "app-container")
                resetSelectMode();
        }

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [isEmptyNodeLabel, treeData]);

    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                resetSelectMode();
                event.preventDefault();
            }
        }
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [isEmptyNodeLabel, treeData])

    const resetSelectMode = (withCheckNodeLabel = true) => {
        const treeCopy = getTreeCopy(treeData);
        if (withCheckNodeLabel) {
            let curNode = getNodeRef(selectedNodeId, treeCopy);
            checkNodeForEmptyLabel(curNode, treeCopy);
        }
        setSelectedMod(false);
        setEditMod(false);
        selectNodeId("");
    }

    const checkNodeForEmptyLabel = (node, treeCopy) => {
        if (isEmptyNodeLabel) {
            node.label = "Default Name";
            setTreeData(treeCopy);
            setIsEmptyNodeLabel(false);
        }
    }

    const getNodeRef = (nodeId, treeCopy) => {
        const arrId = nodeId.split("-");
        let curNode = null;

        arrId.forEach((id, i) => {
            if (curNode === null)
                curNode = treeCopy[findChildIndex(treeCopy, id)];
            else
                curNode = curNode.children[findChildIndex(curNode, arrId.slice(0, i + 1).join("-"))];
        })

        return curNode;
    }

    const findChildIndex = (parentNodeRef, childNodeId) => {
        let index = -1;

        if (!!parentNodeRef.children) {
            for (let node of parentNodeRef.children) {
                index += 1;
                if (node.id === childNodeId)
                    return index;
            }
        } else {
            for (let node of parentNodeRef) {
                index += 1;
                if (node.id === childNodeId)
                    return index;
            }
        }
    }

    const onClickNode = (targetNodeId) => {
        const treeCopy = getTreeCopy(treeData);
        let curNode = getNodeRef(selectedNodeId, treeCopy);
        checkNodeForEmptyLabel(curNode, treeCopy);

        if (targetNodeId !== selectedNodeId) {
            setEditMod(false);
        }
        setSelectedMod(true);
        selectNodeId(targetNodeId);
    }

    const onAddNode = () => {
        const treeCopy = getTreeCopy(treeData);
        const newNodeId = `${treeCopy.length}`;
        treeCopy.push({
            id: newNodeId,
            label: "Default Name",
            children: []
        })
        setTreeData(treeCopy);

        selectNodeId(newNodeId);
        setSelectedMod(true);
        setEditMod(true);
    };

    const onResetTree = () => {
        setTreeData(getTreeCopy(props.data));
    }

    const onEditNode = () => {
        setEditMod(true);
    }

    const onSaveNode = () => {
        const treeCopy = getTreeCopy(treeData);
        let curNode = getNodeRef(selectedNodeId, treeCopy);
        checkNodeForEmptyLabel(curNode, treeCopy);
        setEditMod(false);
    }

    const onDeleteNode = () => {
        const treeCopy = getTreeCopy(treeData);
        if (selectedNodeId.split("-").length === 1) {
            treeCopy.splice(findChildIndex(treeCopy, selectedNodeId), 1);
        } else {
            let curNode = getNodeRef(selectedNodeId.slice(0, -2), treeCopy);
            curNode.children.splice(findChildIndex(curNode, selectedNodeId), 1);
        }
        setTreeData(treeCopy);

        setIsEmptyNodeLabel(false);
        resetSelectMode(false);
    }

    const onAddChildren = () => {
        const treeCopy = getTreeCopy(treeData);
        let curNode = getNodeRef(selectedNodeId, treeCopy);
        checkNodeForEmptyLabel(curNode, treeCopy);
        const newChildId = `${selectedNodeId}-${curNode.children.length}`;

        curNode.children.push({
            id: newChildId,
            label: "Default Name",
            children: []
        })
        setTreeData(treeCopy);

        selectNodeId(newChildId);
        setIsEmptyNodeLabel(true);
        setEditMod(true);
    }

    const onChangeNodeLabel = (label) => {
        const treeCopy = getTreeCopy(treeData);
        let curNode = getNodeRef(selectedNodeId, treeCopy);
        curNode.label = label;
        if (curNode.label.trim().length === 0)
            setIsEmptyNodeLabel(true);
        else
            setIsEmptyNodeLabel(false);
        setTreeData(treeCopy);
    }

    return (
        <div className={"tree-container"}>
            <h3>Tree</h3>
            {
                treeData.length === 0 ?
                    <div className={"empty-tree"}>Empty</div> :
                    <ul>
                        {
                            treeData.map((node) => (
                                <Node data={node} key={node.id} onClickNode={onClickNode}
                                      selectedNodeId={selectedNodeId} isEditMod={isEditMod}
                                      onChangeNodeLabel={onChangeNodeLabel} onEditNode={onEditNode}
                                />
                            ))
                        }
                    </ul>
            }
            <div className={"button-container"}>
                {
                    isSelectedMod ?
                        <div>
                            <button onClick={onAddChildren}>Add children</button>
                            {
                                isEditMod ? <button onClick={onSaveNode}>Save</button>
                                    : <button onClick={onEditNode}>Edit</button>

                            }
                            <button onClick={onDeleteNode}>Delete</button>
                        </div>
                        :
                        <div>
                            <button onClick={onAddNode}>Add node</button>
                            <button onClick={onResetTree}>Reset</button>
                        </div>
                }
            </div>
        </div>
    );
}

export default Tree;