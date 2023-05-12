import './App.css';
import {useEffect, useState} from "react";

const Tree = (props) => {

    const initData = props.data;

    const [treeData, setTreeData] = useState(props.data);
    const [isEditMod, setEditMod] = useState(false);
    const [editNodeId, setEditNodeId] = useState("");

    useEffect(() => {

        function handleOutsideClick(event) {
            if (event.target.className === "app-container") {
                setEditMod(false);
                setEditNodeId("");
            }
        }

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [isEditMod]);

    useEffect(() => {
        console.log(editNodeId)
    }, [editNodeId])

    const onClickNode = (id) => {
        setEditMod(true);
        setEditNodeId(id);
    }

    const onAddNode = () => {
        setTreeData(
            [
                ...treeData,
                {
                    id: `${treeData.length}`,
                    label: "Лох",
                    children: []
                }
            ]
        )
    };

    const onResetTree = () => {
        setTreeData(initData);
    }

    return (
        <div className={"tree-container"}>
            <h3>Tree</h3>
            <ul>
                {
                    treeData.map((node) => (
                        <Node data={node} key={node.id} onClickNode={onClickNode}
                              editNodeId={editNodeId}/>
                    ))
                }
            </ul>
            <div className={"button-container"}>
                {
                    isEditMod ?
                        <div>
                            <button>Add children</button>
                            <button>Edit</button>
                            <button>Delete</button>
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

const Node = (props) => {

    return (
        <li>
            <div onClick={() => props.onClickNode(props.data.id)}
                 className={props.editNodeId === props.data.id ? "node-title choose-node" : "node-title"}>
                {props.data.label}
            </div>
            <ul>
                {
                    props.data.children.map((node) => (
                        <Node data={node} key={node.id} onClickNode={props.onClickNode}
                              editNodeId={props.editNodeId}/>
                    ))
                }
            </ul>
        </li>

    )
}

function App() {

    const treeData = [
        {
            id: "0",
            label: "Цветы",
            children: [
                {
                    id: "0-0",
                    label: "Розы",
                    children: [
                        {
                            id: "0-0-0",
                            label: "Красные",
                            children: []
                        },
                        {
                            id: "0-0-1",
                            label: "Белые",
                            children: []
                        },
                    ],
                },
            ],
        },
        {
            id: "1",
            label: "Деревья",
            children: [
                {
                    id: "1-0",
                    label: "Хвойные",
                    children: []
                },
                {
                    id: "1-1",
                    label: "Лиственные",
                    children: []
                },
            ],
        },
        {
            id: "2",
            label: "Кустарники",
            children: [],
        },
    ];

    return (
        <div className="app-container">
            <Tree data={treeData}/>
        </div>
    );
}

export default App;
