import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CancelPresentationIconButton from "../Buttons/CancelPresentationIconButton";
import useGeneratePdf from "./GeneratePdfHook";

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85%",
  height: "90%",
  minHeight: "65%",
  // maxHeight: "80%",
  overflowY: "scroll",
  bgcolor: "background.paper",
  border: "1px solid gray",
  boxShadow: 20,
  py: 4,
  px: 2,
};

export default function CommonPrintModal(props) {
  // console.log(props, "props @mlc modal");
  const { open, setOpen, handleOpen, handleClose, urlforPrint } = props;

  const fileURL = useGeneratePdf(urlforPrint);

  return (
    <div>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle} className="max-h-[88%] xl:max-h-[100%]">
          <CancelPresentationIconButton
            onClick={() => {
              props.setOpen(false);
              handleClose();
            }}
          />

          {fileURL && fileURL ? (
            <embed width="100%" height="100%" src={fileURL} target="_blank" />
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </div>
  );
}
