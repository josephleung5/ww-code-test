import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';

const NiCompareTable = ({ niContributions }) => (
  <Stack spacing={2}>
    <h2>Your Results</h2>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 'sm' }} aria-label="comparison-table">
        <TableHead>
          <TableRow>
            <TableCell>Year</TableCell>
            <TableCell>Gross Income</TableCell>
            <TableCell>Ni Contributions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {niContributions.map((niContribution) => (
            <TableRow key={niContribution.year}>
              <TableCell>{niContribution.year}</TableCell>
              <TableCell>{`£${Number(niContribution.income).toFixed(2)}`}</TableCell>
              <TableCell>{`£${Number(niContribution.ni).toFixed(2)}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Stack>
);

NiCompareTable.propTypes = {
  niContributions: PropTypes.arrayOf(PropTypes.shape({
    year: PropTypes.string.isRequired,
    ni: PropTypes.string.isRequired,
    income: PropTypes.string.isRequired,
  })).isRequired,
};

export default NiCompareTable;
