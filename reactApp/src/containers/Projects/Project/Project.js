import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "./../../../components/UI/Button/Button";
import classes from "./Project.module.css";
import { Redirect } from "react-router-dom";
import Highlight, { defaultProps } from "prism-react-renderer";
import {
  deleteProject,
  generateProjectZip,
  loadProjectSchema,
} from "./../../../store/userDataSlice";
import { editingSchema, clearSchema } from "./../../../store/schemaSlice";
import Modal from "../../../components/UI/Modal/Modal";
const Project = (props) => {
  const dispatch = useDispatch();
  const [preview, togglePreview] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const deleteProjectHandler = (project) => {
    dispatch(deleteProject(project));
  };
  const schema = useSelector((state) => {
    return state.schemaConfig.schema;
  });
  const editProjectHandler = (project) => {
    dispatch(loadProjectSchema(project));
    dispatch(editingSchema());
    setTimeout(() => {
      setButtonClicked(true);
    }, 300);
  };
  const previewHandler = (project) => {
    dispatch(loadProjectSchema(project));
    togglePreview(true);
  };
  const downloadHandler = (project) => {
    dispatch(generateProjectZip(project));
  };

  let authRedirect = null;
  if (buttonClicked) {
    authRedirect = <Redirect to="/craft" />;
  }
  const modalCloseHandler = () => {
    togglePreview(false);
    dispatch(clearSchema());
  };
  return (
    <>
      <div className={classes.project}>
        <span>{props.name}</span>
        {authRedirect}

        <div className={classes.buttons}>
          <Button
            clicked={() => deleteProjectHandler(props.name)}
            btnType="RemoveField"
          >
            Delete
          </Button>
          <span>*****</span>
          <Button clicked={() => previewHandler(props.name)} btnType="Preview">
            Preview
          </Button>
          <Button clicked={() => editProjectHandler(props.name)} btnType="Edit">
            Edit
          </Button>
          <Button
            clicked={() => downloadHandler(props.name)}
            btnType="Download"
          >
            Download
          </Button>
        </div>
        <Modal
          show={preview}
          modalClosed={modalCloseHandler}
          title="Project schema preview"
        >
          <Highlight
            {...defaultProps}
            code={JSON.stringify(schema, null, 2)}
            language="json"
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={style}>
                {tokens.map((line, i) => (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </Modal>
      </div>
    </>
  );
};

export default Project;
