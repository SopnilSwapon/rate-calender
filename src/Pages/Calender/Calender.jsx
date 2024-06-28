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
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  // function createData(name, calories, fat, carbs, protein) {
  //   return { name, calories, fat, carbs, protein };
  // }

  // const rows = [
  //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData('Eclair', 262, 16.0, 24, 6.0),
  //   createData('Cupcake', 305, 3.7, 67, 4.3),
  //   createData('Gingerbread', 356, 16.0, 49, 3.9),
  // ];

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

export default function SingleInputDateRangePicker() {
    const [dates, setDates] = useState([])
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
      console.log(datesArray);
      setDates(datesArray)
    }
  };
 console.log(dates);
 const {data:rooms=[], isPending, error} = useQuery({
  queryKey: ['rooms'],
  queryFn: async () =>{
    const res =await fetch('https://api.bytebeds.com/api/v1/property/1/room/rate-calendar/assessment?start_date=2024-05-01&end_date=2024-05-14');
    return res.json();
  }
})
if (isPending) return 'Loading...'

if (error) return 'An error has occurred: ' + error.message;
console.log(rooms?.data);
  return (
    <LocalizationProvider  dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']}>
        <DateRangePicker className='w-[25%]'
          slots={{ field: SingleInputDateRangeField }}
          name="allowedRange"
          onChange={handleDateChange}
        />
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
          <StyledTableCell align='right'>Information about room</StyledTableCell>
            {
                dates.map((date, index) =><StyledTableCell align='right' key={index}>{date.slice(0, 2)} <br /> {date.slice(3, 7)}</StyledTableCell>)
            }
          </TableRow>
        </TableHead>
       {
        rooms?.data.map((room, index)=> <TableBody key={index}>
          {
            <StyledTableRow className='text-xl font-bold text-nowrap'>{room?.name}</StyledTableRow>
          }
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <p>Room status</p>
              </StyledTableCell>              
              {
                room?.inventory_calendar?.map((roomStatus, index) =><StyledTableCell align="right" key={index} className='bg-green-700 !text-white'>{roomStatus?.status === true ? 'Open' : 'close'}</StyledTableCell>)
              }
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <p>Rooms Sell</p>
              </StyledTableCell>              
              {
                room?.inventory_calendar?.map((isSell, index) =><StyledTableCell align="right" key={index}>{isSell?.available ? isSell?.available : 0}</StyledTableCell>)
              }
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                <p>Net Booked</p>
              </StyledTableCell>              
              {
                room?.inventory_calendar?.map((isBooked, index) =><StyledTableCell align="right" key={index}>{isBooked?.booked ? isBooked?.booked : 0}</StyledTableCell>)
              }
            </StyledTableRow>
            
        </TableBody>)
       }

      </Table>
    </TableContainer>
      </DemoContainer>
    </LocalizationProvider>
  );
}
