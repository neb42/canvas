import styled from 'styled-components';
import Color from 'color';

export const Container = styled.div`
  height: 100%;
`;

export const Header = styled.div`
  padding: 8px 16px;
  background-color: #1c1c1c;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;

export const Tree = styled.div`
  padding: 16px;
`;

interface ITreeNode {
  depth: number;
}

export const TreeNode = styled.div`
  margin-left: ${({ depth }: ITreeNode) => 8 * depth}px;
`;

interface ITreeItemLabel {
  active: boolean;
}

export const TreeItemLabel = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 8px;
  align-items: center;
  cursor: pointer;
  transition: background-color 300ms;
  padding-left: 8px;
  padding-right: 4px;
  border-radius: 3px;

  background-color: ${({ active }: ITreeItemLabel) =>
    active ? Color('#fa7268').alpha(0.4).hsl().string() : 'none'};

  &:hover {
    background-color: ${({ active }: ITreeItemLabel) =>
      Color(active ? '#fa7268' : '#cfcfcf')
        .alpha(0.4)
        .hsl()
        .string()};
  }

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface ITreeItemActions {
  selected: boolean;
}

export const TreeItemActions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-column-gap: 8px;
  transition: max-width 600ms;
  overflow: hidden;
  max-width: ${({ selected }: ITreeItemActions) => (selected ? '144px' : '0')};

  ${TreeItemLabel}:hover & {
    max-width: 144px;
  }
`;