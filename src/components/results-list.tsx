import { Button, List } from "antd";
import { observer } from "mobx-react-lite";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { useRootStore } from "../utils/use-root-store";

const ResultListWrapper = styled.div`
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  flex-direction: column;

  & > *:first-child {
    align-self: stretch;
    overflow-y: scroll;
  }
`;

const StyledButton = styled(Button)`
  display: grid;
  //grid-template-rows: 1fr;
  align-items: right;
  margin: 1em;

  width: max-content;

  & > span {
    margin-right: 0.125rem;
  }
`;

export const ResultsList = styled(
  observer(
    ({
      fileIds,
      onSelectItem,
      className,
    }: {
      fileIds: string[];
      onSelectItem: (id: string) => void;
      className?: string;
    }) => {
      const store = useRootStore();
      const getFormattedData = () => {
        return fileIds.map((id, i) => ({
          rank: i + 1,
          ...store.metadata[id],
        }));
      };

      return (
        <ResultListWrapper className={className}>
          <List
            className="ant-list-item"
            size="large"
            bordered
            dataSource={fileIds}
            renderItem={(itemId, index) => (
              <ListItem itemId={itemId} rank={index} onSelect={onSelectItem} />
            )}
          />

          <StyledButton type="dashed" name="export-csv-btn">
            <CSVLink
              filename={"SortResult.csv"}
              data={getFormattedData()}
              className="export-csv"
            >
              <span>Export to CSV</span>
            </CSVLink>
          </StyledButton>
        </ResultListWrapper>
      );
    }
  )
)``;

const ListItem = observer(
  ({
    itemId,
    rank,
    onSelect,
  }: {
    itemId: string;
    rank: number;
    onSelect: (id: string) => void;
  }) => {
    const store = useRootStore();
    const item = store.metadata[itemId];

    if (!item) return <></>;

    return (
      <List.Item
        onClick={() => onSelect(item.id)}
        actions={[
          <Button type="link" onClick={() => onSelect(itemId)}>
            View
          </Button>,
        ]}
        className="ant-list-item"
      >
        <span style={{ marginRight: "2rem" }}>{rank + 1}</span>
        <span>{item.name}</span>
      </List.Item>
    );
  }
);
