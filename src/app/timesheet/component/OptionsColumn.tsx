import { ChecksUpdate, Option, Participant, Selection, UpsertMessageParam, UpsertParticipantParam } from "@/dto/dto";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useTimesheetStyles from "./styles/useTimesheetStyles";
import useApiClient from "@/hooks/useApiClient";
import MyTextField from "@/component/MyTextField";
import WarningDialog from "@/component/dialogs/WarningDialog";
import { useAppDispatch } from "@/redux/hooks";
import { Checkbox } from "@mui/material";
import { debounce, cloneDeep } from "lodash";
import { BiMessageRounded } from "react-icons/bi";
import appSlice from "../../../../appSlice";
import DeleteIcon from '@mui/icons-material/Clear';

const COLUMN_WIDTH = 120

const OptionsColumn = ({
  participantMessage,
  username,
  uuid,
  options,
  dailyId,
  selections,
  successSelectionIds,
  refreshParticipants,
  onCheck,
  setParticipants,
  upsertParticipant
}: {

  participantMessage: string,
  username: string,
  uuid: string,
  dailyId: number
  options?: Option[],
  selections: Selection[],
  successSelectionIds: number[],
  refreshParticipants: () => Promise<void>,
  setParticipants: Dispatch<SetStateAction<Participant[]>>,
  onCheck: (props: ChecksUpdate) => void,
  upsertParticipant: (params: UpsertParticipantParam) => void
}) => {
  const { classes, cx } = useTimesheetStyles();
  const apiClient = useApiClient();
  const [name, setName] = useState(username || "");
  const messageDialogContent = useRef<string>("");
  const updateDialogMessageDialogContent = (msg: string) => {
    messageDialogContent.current = msg;
  }
  const dispatch = useAppDispatch();
  const updateName = debounce((text: string) => {
    setName(text);
  }, 1000)

  const deleteColumn = () => {
    setParticipants(ps => {
      const deleteIndex = ps.findIndex(p => p.frontendUUID === uuid);
      const ps_ = cloneDeep(ps);
      const newPs = [...ps_.slice(0, deleteIndex), ...ps_.slice(deleteIndex + 1)];
      return newPs;
    })
    apiClient.delete(`/timesheet/delete-participant/${uuid}`)
  }

  const updateMessage = async () => {
    const reqBody: UpsertMessageParam = {
      message: messageDialogContent.current,
      participantUUID: uuid
    };
    dispatch(appSlice.actions.setLoading(true));
    await apiClient.post("/timesheet/upsert-message", reqBody);
    dispatch(appSlice.actions.setLoading(false));
    await refreshParticipants();
  }

  return (
    <table>
      <tbody>
        <tr><td style={{
          textAlign: "center",
          opacity: participantMessage ? 1 : 0.2,
          cursor: "pointer"
        }}
          onClick={async () => {
            WarningDialog.setContent({
              title: "",
              desc: () => <MessageContent
                updateDialogMessageDialogContent={updateDialogMessageDialogContent}
                uuid={uuid}
              />,
              no: {
                text: "Cancel"
              },
              yes: {
                text: "Ok",
                action: updateMessage
              }
            });
            WarningDialog.open();
          }}
        ><BiMessageRounded size={28} /></td></tr>
        <tr><td style={{ textAlign: "center", width: COLUMN_WIDTH, position: "relative" }}>
          <MyTextField
            defaultValue={name}
            placeholder="Name"
            style={{ paddingTop: 0, paddingBottom: 0 }}
            onChange={e => {
              const text = e.target.value;
              updateName(text);
              upsertParticipant({
                dailyId,
                username: text,
                userUUID: uuid,
              })
            }}
          />
          <DeleteIcon
            onClick={() => { deleteColumn() }}
            className={cx(classes.deleteButton)}
            fontSize={"small"}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              cursor: "pointer",
              zIndex: 10
            }} />
        </td>
        </tr>

        {options?.map(opt => {
          const { id } = opt;
          const defaultChecked = (() => {
            const exists = selections.find(s => s.timeAvailableOptionId === id);
            if (exists) {
              return true;
            } else {
              return false;
            }
          })()
          const isSuccessId = successSelectionIds.includes(id);

          return (
            <tr key={`${id}-opt`}>
              <td style={{ textAlign: "center" }}
                className={cx(isSuccessId ? classes.successCell : null)}
              >
                <Checkbox
                  disabled={!name}
                  defaultChecked={defaultChecked}
                  onChange={e => {
                    const checked = e.target.checked;
                    onCheck({
                      checked,
                      selectionId: id,
                      timeslotDailyId: dailyId,
                      userUUID: uuid
                    })
                  }}
                />
              </td>
            </tr>
          )
        })}
      </tbody>

    </table>
  )
}

const MessageContent = ({
  uuid,
  updateDialogMessageDialogContent
}: {
  uuid: string,
  updateDialogMessageDialogContent: (msg: string) => void
}) => {
  const { classes, cx } = useTimesheetStyles();
  const apiClient = useApiClient();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    apiClient.get<{ result: { message: string } }>(
      `/timesheet/get-message/${uuid}`
    ).then((res) => {
      const msg_ = res.data.result.message;
      setMsg(msg_);
    });
  }, [])
  return (
    <textarea
      defaultValue={msg}
      onKeyUp={e => {
        updateDialogMessageDialogContent(e.currentTarget.value)
      }}
      className={cx(classes.textArea)}
      style={{
        width: 400,
        height: 170
      }}
    />
  )
}

export default OptionsColumn;