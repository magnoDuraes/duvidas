import React from "react";
import { Button, Form, Modal } from "semantic-ui-react";

export default function ModalEdit({
  header,
  fields,
  trigger,
  config: { open, setOpen },
  submitConfig: { handleSubmit, submitFunction },
}) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen()}
      trigger={trigger}
      dimmer="blurring"
      closeIcon
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(submitFunction)}  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap:"20px" }}>
          {fields
            ? fields.map((f, i) => (
                <Form.Field key={i} styles={{maxWidth:"10px"}}>
                  <label>{f.label}</label>
                  {f.component}
                </Form.Field>
              ))
            : null}
          <hr />
          <Button
            color="black"
            onClick={() => setOpen()}
            floated="right"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            Cancelar
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Salvar"
            type="submit"
            floated="right"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          />
        </Form>
      </Modal.Content>
    </Modal>
  );
}
