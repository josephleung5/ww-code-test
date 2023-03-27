import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Stack,
} from '@mui/material';
import NiCompareTable from './NiCompareTable';

const NI_CALCULATOR_URL = 'http://localhost:8080/v1/national-insurance';

const NiCompare = () => {
  const [grossIncome1819, setGrossIncome1819] = useState(0);
  const [grossIncome1920, setGrossIncome1920] = useState(0);
  const [niComparisonData, setNiComparisonData] = useState([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isServerError, setIsServerError] = useState(false);

  const fetchNi = (runDate, income) => fetch(NI_CALCULATOR_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-run-date': runDate,
    },
    body: JSON.stringify({ income }),
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsFormSubmitting(true);
    setIsServerError(false);

    const fetchNi1819 = fetchNi('2018-04-06', grossIncome1819);
    const fetchNi1920 = fetchNi('2019-04-06', grossIncome1920);

    Promise.all([fetchNi1819, fetchNi1920])
      .then(async ([ni1819Resp, ni1920Resp]) => {
        const a = await ni1819Resp.json();
        const b = await ni1920Resp.json();
        return [a, b];
      })
      .then((response) => {
        const displayData = [];
        displayData[0] = { year: '2018/19', ...response[0] };
        displayData[1] = { year: '2019/20', ...response[1] };
        setNiComparisonData(displayData);
        setIsFormSubmitting(false);
      })
      .catch((error) => {
        setIsFormSubmitting(false);
        setIsServerError(true);
        console.error('Ni calculator API error: ', error);
      });
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
    >
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            maxWidth: 'sm',
          }}
        >
          <h1>NI contributions comparison between 2018/19 and 2019/20</h1>
          <TextField
            required
            label="Gross Income 2018/2019"
            name="grossIncomeInput1819"
            type="number"
            aria-label="gross-income-input-2018-2019"
            inputProps={{ 'data-testid': 'gross-income-input-2018-2019' }}
            value={grossIncome1819}
            onChange={(e) => setGrossIncome1819(e.target.value)}
          />
          <TextField
            required
            label="Gross Income 2019/2020"
            name="grossIncomeInput1920"
            type="number"
            aria-label="gross-income-input-2019-2020"
            inputProps={{ 'data-testid': 'gross-income-input-2019-2020' }}
            value={grossIncome1920}
            onChange={(e) => setGrossIncome1920(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
          >
            Compare
          </Button>
          {niComparisonData.length > 0
            ? (
              <NiCompareTable niContributions={niComparisonData} />
            )
            : null}
          {isFormSubmitting ? <p>Loading...</p> : null}
          {isServerError ? <p>There is an error, please try later</p> : null}
        </Stack>
      </Container>
    </Box>
  );
};

export default NiCompare;
