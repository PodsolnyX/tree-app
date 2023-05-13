import {useEffect, useState} from "react";
import Node from "./node/node";

const Tree = (props) => {

    const [treeData, setTreeData] = useState(JSON.parse(JSON.stringify(props.data)));
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
    }, [isEmptyNodeLabel]);

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
    }, [isEmptyNodeLabel])

    const resetSelectMode = () => {
        if (isEmptyNodeLabel) {
            let curNode = getNodeRef(selectedNodeId);
            curNode.label = "Default Name";
            setTreeData([...treeData]);
            setIsEmptyNodeLabel(false);
        }
        setSelectedMod(false);
        setEditMod(false);
        selectNodeId("");
    }

    const getNodeRef = (nodeId) => {
        let curNode = null;

        for (let i = 1; i <= nodeId.length; i += 2) {
            if (curNode === null)
                curNode = treeData[findChildIndex(treeData, nodeId.slice(0, i))];
            else
                curNode = curNode.children[findChildIndex(curNode, nodeId.slice(0, i))];
        }
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

    const onClickNode = (id) => {
        if (isEmptyNodeLabel) {
            let curNode = getNodeRef(selectedNodeId);
            curNode.label = "Default Name";
            setTreeData([...treeData]);
            setIsEmptyNodeLabel(false);
        }
        if (id !== selectedNodeId) {
            setEditMod(false);
        }
        setSelectedMod(true);
        selectNodeId(id);
    }

    const onAddNode = () => {
        const newNodeId = `${treeData.length}`;
        setTreeData(
            [
                ...treeData,
                {
                    id: newNodeId,
                    label: "Default Name",
                    children: []
                }
            ]
        )
        setSelectedMod(true);
        selectNodeId(newNodeId);
        setEditMod(true);
    };

    const onResetTree = () => {
        setTreeData(JSON.parse(JSON.stringify(props.data)));
    }

    const onEditNode = () => {
        setEditMod(true);
    }

    const onDeleteNode = () => {
        if (selectedNodeId.length === 1) {
            treeData.splice(findChildIndex(treeData, selectedNodeId), 1);
        } else {
            let curNode = getNodeRef(selectedNodeId.slice(0, -2));
            curNode.children.splice(findChildIndex(curNode, selectedNodeId), 1);
        }
        setTreeData([...treeData]);
        setIsEmptyNodeLabel(false);
        setSelectedMod(false);
        setEditMod(false);
        selectNodeId("");
    }

    const onAddChildren = () => {
        let curNode = getNodeRef(selectedNodeId);

        if (isEmptyNodeLabel) {
            curNode.label = "Default Name";
            setTreeData([...treeData]);
            setIsEmptyNodeLabel(false);
        }

        const newChildId = `${selectedNodeId}-${curNode.children.length}`;

        curNode.children.push({
            id: newChildId,
            label: "Default Name",
            children: []
        })

        setTreeData([...treeData]);
        selectNodeId(newChildId);
        setIsEmptyNodeLabel(true);
        setEditMod(true);
    }

    const onChangeNodeLabel = (label) => {
        let curNode = getNodeRef(selectedNodeId);
        curNode.label = label;
        if (curNode.label.length === 0)
            setIsEmptyNodeLabel(true);
        else
            setIsEmptyNodeLabel(false);
        setTreeData([...treeData]);
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
                            <button onClick={onEditNode}>Edit</button>
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