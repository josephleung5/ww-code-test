/* eslint-disable no-unused-expressions */
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import React from 'react';
import NiCompare from './NiCompare';

const ALLOWANCE = 702;
const BASIC_CEILING = 3863;
const GROSS_INCOME_1819 = (ALLOWANCE + 1000).toString();
const GROSS_INCOME_1920 = (BASIC_CEILING + 1000).toString();
const NI_CONTRIBUTION_1819 = '120.00';
const NI_CONTRIBUTION_1920 = '399.32';

describe('NiCompare component', () => {
  it('renders and display the NI comparison form correctly', () => {
    // eslint-disable-next-line react/jsx-filename-extension
    render(<NiCompare />);

    const title = screen.getByText('NI contributions comparison between 2018/19 and 2019/20');
    const grossIncomeInput1819 = screen.getByTestId('gross-income-input-2018-2019');
    const grossIncomeInput1920 = screen.getByTestId('gross-income-input-2019-2020');
    const compareButton = screen.getByRole('button');

    expect(title).toBeInTheDocument();
    expect(grossIncomeInput1819).toBeInTheDocument();
    expect(grossIncomeInput1920).toBeInTheDocument();
    expect(compareButton).toBeInTheDocument();
  });

  it('renders the comparison table correctly when form is submitted', async () => {
    const mockNi1819Response = {
      income: GROSS_INCOME_1819,
      ni: NI_CONTRIBUTION_1819,
    };

    const mockNi1920Response = {
      income: GROSS_INCOME_1920,
      ni: NI_CONTRIBUTION_1920,
    };

    global.fetch = jest.fn((req, res) => {
      if (res.headers['x-run-date'] === '2018-04-06') {
        return Promise.resolve({
          json: () => Promise.resolve(mockNi1819Response),
        });
      }

      return Promise.resolve({
        json: () => Promise.resolve(mockNi1920Response),
      });
    });

    render(<NiCompare />);

    const grossIncomeInput1819 = screen.getByTestId('gross-income-input-2018-2019');
    const grossIncomeInput1920 = screen.getByTestId('gross-income-input-2019-2020');
    const compareButton = screen.getByRole('button');

    fireEvent.change(grossIncomeInput1819, { target: { value: GROSS_INCOME_1819 } });
    fireEvent.change(grossIncomeInput1920, { target: { value: GROSS_INCOME_1920 } });
    fireEvent.click(compareButton);

    await screen.findByText('Loading...');
    const comparisonTableTitle = await screen.findByText('Your Results');
    const comparisonTable = screen.getByLabelText('comparison-table');
    const niContributions1819 = screen.getByText(`£${NI_CONTRIBUTION_1819}`);
    const niContributions1920 = screen.getByText(`£${NI_CONTRIBUTION_1920}`);

    expect(comparisonTableTitle).toBeInTheDocument();
    expect(comparisonTable).toBeInTheDocument();
    expect(niContributions1819).toBeInTheDocument();
    expect(niContributions1920).toBeInTheDocument();

    fetch.mockClear();
  });

  it('handle server errors', async () => {
    // global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
    //   status: 500,
    //   json: () => Promise.resolve({ ok: false, error: 'Something bad happened' }),
    // }));

    global.fetch = jest.fn(() => Promise.reject(new Error('Server error')));

    render(<NiCompare />);

    const grossIncomeInput1819 = screen.getByTestId('gross-income-input-2018-2019');
    const grossIncomeInput1920 = screen.getByTestId('gross-income-input-2019-2020');
    const compareButton = screen.getByRole('button');

    fireEvent.change(grossIncomeInput1819, { target: { value: GROSS_INCOME_1819 } });
    fireEvent.change(grossIncomeInput1920, { target: { value: GROSS_INCOME_1920 } });
    fireEvent.click(compareButton);

    await screen.findByText('Loading...');
    await screen.findByText('There is an error, please try later');

    fetch.mockClear();
  });
});
