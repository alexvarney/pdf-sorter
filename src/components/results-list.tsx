import { Button, List } from "antd";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useRootStore } from "../utils/use-root-store";

const ResultListWrapper = styled.div`
  & > .ant-list-item:hover {
    /* box-shadow: 0 0 4px #53ed6d; */
  }
`;

export const ResultsList = observer(
  (props: {
    fileIds: string[];
    onSelectItem: (id: string) => void;
    className?: string;
  }) => {
    return (
      <ResultListWrapper className={props.className}>
        <List
          className="ant-list-item"
          size="large"
          bordered
          dataSource={props.fileIds}
          renderItem={(itemId, index) => (
            <ListItem
              itemId={itemId}
              rank={index}
              onSelect={props.onSelectItem}
            />
          )}
        />
      </ResultListWrapper>
    );
  }
);

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
        <span>{rank + 1}</span>
        <span>{item.name}</span>
      </List.Item>
    );
  }
);
