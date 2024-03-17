import React, { ReactNode } from 'react';
import styled from 'styled-components';

const StyledVTable = styled.table`
  border-spacing: 0;

  tr {
    &:not(:last-child) {
      td {
        border-bottom: 1px solid #585858;
      }
    }

    &.row--empty {
      td:first-child {
        color: #a0a0a0;
        font-size: 14px;
        font-weight: 400;
        line-height: 1;
      }
    }

    &.row--clickable {
      cursor: pointer;
    }

    td {
      padding: 12px;
      line-height: 1.5;

      &:not(:last-child) {
        white-space: nowrap;
        vertical-align: baseline;
      }

      &:first-child {
        font-weight: 700;
      }
    }
  }
`;

type VTableRow = {
  key: string;
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
  emptyMessage?: string | null;
  onRowClick?: (row: T) => void;
};

export const VTable = <T extends VTableRow>(props: VTableProps<T>) => {
  return (
    <StyledVTable>
      <tbody>
        {props.rows.map(row => (
          <tr
            key={row.key}
            onClick={() => props.onRowClick?.(row)}
            className={props.onRowClick ? 'row--clickable' : ''}
          >
            {props.columns.map(column => (
              <td key={column.key} style={{ width: column.width }}>
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
