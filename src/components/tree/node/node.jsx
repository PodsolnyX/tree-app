const Node = (props) => {

    return (
        <li>
            <div onClick={() => props.onClickNode(props.data.id)} onDoubleClick={() => props.onEditNode()}
                 className={props.selectedNodeId === props.data.id ? "node-title choose-node" : "node-title"}
            >
                {
                    props.isEditMod && props.selectedNodeId === props.data.id ?
                        <input autoFocus type="text" placeholder={"Name of node"}
                               value={props.data.label} className={"input-node-label"}
                               onChange={(e) => props.onChangeNodeLabel(e.target.value)}/>
                         :
                        <div>
                            {props.data.label}
                        </div>
                }
            </div>

            <ul>
                {
                    props.data.children.map((node) => (
                        <Node data={node} key={node.id} onClickNode={props.onClickNode}
                              selectedNodeId={props.selectedNodeId} isEditMod={props.isEditMod}
                              onChangeNodeLabel={props.onChangeNodeLabel} onEditNode={props.onEditNode}
                        />
                    ))
                }
            </ul>
        </li>

    )
}

export default Node;