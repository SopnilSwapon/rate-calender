import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaUsers } from "react-icons/fa6";
import MinLenghtRow from '../../components/MinLenghtRow';
import ReservationRow from '../../components/ReservationRow';
import RoomRates from '../../components/RoomRates';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

export default function SingleInputDateRangePicker() {
  const [dates, setDates] = useState([]);

  const handleDateChange = (newValue) => {
    const [start, end] = newValue;
    if (start && end) {
      let currentDate = start;
      const datesArray = [];
      while (currentDate.isBefore(end) || currentDate.isSame(end)) {
        const dayOfMonth = currentDate.format('D');
        const dayName = currentDate.format('ddd');
        datesArray.push(`${dayOfMonth}, ${dayName}`);
        currentDate = currentDate.add(1, 'day');
      }
      setDates(datesArray);
    }
  };

  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await fetch('https://api.bytebeds.com/api/v1/property/1/room/rate-calendar/assessment?start_date=2024-07-01&end_date=2024-08-15');
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }
  });

  if (isLoading) return 'Loading...';
  if (error) return `An error has occurred: ${error.message}`;



  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker
          className='w-[25%]'
          slots={{ field: SingleInputDateRangeField }}
          name="allowedRange"
          onChange={handleDateChange}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align='right'>Information about room</StyledTableCell>
                {dates.map((date, index) => (
                  <StyledTableCell align='right' key={index}>{date.split(', ')[0]} <br /> {date.split(', ')[1]}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            {rooms?.data?.map((room, index) => (
              <TableBody key={index}>
                {
                  <StyledTableRow className='text-xl font-bold text-nowrap'>{room?.name}</StyledTableRow>
                }
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    <p>Room status</p>
                  </StyledTableCell>
                  {room?.inventory_calendar?.map((roomStatus, index) => (
                    <StyledTableCell align="right" key={index} className='bg-green-700 !text-white'>
                      {roomStatus?.status ? 'Open' : 'Close'}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    <p>Rooms Sell</p>
                  </StyledTableCell>
                  {room?.inventory_calendar?.map((isSell, index) => (
                    <StyledTableCell align="right" key={index}>
                      {isSell?.available ?? 0}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    <p>Net Booked</p>
                  </StyledTableCell>
                  {room?.inventory_calendar?.map((isBooked, index) => (
                    <StyledTableCell align="right" key={index}>
                      {isBooked?.booked ?? 0}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                {
                  room?.rate_plans?.map((plan, idx) => <>
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        <p>{plan?.name} <br /> <span className='flex items-center gap-2'><FaUsers className='text-green-500' /> X {room?.occupancy}</span></p>
                      </StyledTableCell>
                      
                         <RoomRates key={idx} roomRates={plan}></RoomRates>
                      
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        <p>Min.length of Stay</p>
                      </StyledTableCell>
                      {
                        <MinLenghtRow key={idx} minLegthsInfo={plan}></MinLenghtRow>
                      }
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell component="th" scope="row">
                        <p>Min. advance reservation</p>
                      </StyledTableCell>
                      
                         <ReservationRow key={idx} reservationInfo={plan}></ReservationRow>
                      
                    </StyledTableRow>
                  </>)
                }
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </DemoContainer>
    </LocalizationProvider>
  );
}
