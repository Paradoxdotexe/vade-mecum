import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVTable = styled.table`
  border-spacing: 0;
  width: 100%;

  tr {
    &:not(:last-child) {
      td {
        border-bottom: 1px solid ${props => props.theme.color.border.default};
      }
    }

    &.row--empty {
      td:first-child {
        color: ${props => props.theme.color.text.tertiary};
        font-weight: 400;
        text-align: center;
      }
    }

    &.row--clickable {
      cursor: pointer;

      &:hover {
        background: ${props => props.theme.color.background.hovered};
      }
    }

    &.row--disabled {
      cursor: default;
      pointer-events: none;
      opacity: 0.6;
    }

    td {
      padding: ${props => props.theme.variable.gap.md} ${props => props.theme.variable.gap.lg};
      line-height: 1.5;

      &:first-child {
        font-weight: 600;
      }

      &:last-child {
      }
    }
  }
`;

type VTableRow = {
  [key: string]: unknown;
  disabled?: boolean;
};

export type VTableColumn<T extends VTableRow> = {
  key: string;
  dataKey?: keyof T;
  render?: (row: T) => ReactNode;
  width?: string;
};

type VTableProps<T extends VTableRow> = {
  columns: VTableColumn<T>[];
  rows: T[];
  rowKey?: keyof T;
  emptyMessage?: string | null;
  onRowClick?: (row: T) => void;
  rowDisabled?: (row: T) => boolean;
};

export const VTable = <T extends VTableRow>(props: VTableProps<T>) => {
  return (
    <StyledVTable>
      <tbody>
        {props.rows.map(row => (
          <tr
            key={row[props.rowKey ?? 'key'] as string}
            onClick={() => props.onRowClick?.(row)}
            className={`${props.onRowClick ? 'row--clickable' : ''} ${props.rowDisabled?.(row) ? 'row--disabled' : ''}`}
          >
            {props.columns.map(column => (
              <td
                key={column.key}
                style={{
                  width: column.width,
                  whiteSpace: column.width === '100%' ? 'normal' : 'nowrap'
                }}
              >
                {column.dataKey ? `${row[column.dataKey]}` : column.render?.(row)}
              </td>
            ))}
          </tr>
        ))}
        {!props.rows.length && props.emptyMessage !== null && (
          <tr className="row--empty">
            <td>{props.emptyMessage ?? 'No data.'}</td>
          </tr>
        )}
      </tbody>
    </StyledVTable>
  );
};
