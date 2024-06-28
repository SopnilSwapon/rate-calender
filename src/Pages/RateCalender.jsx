import { useQuery } from "@tanstack/react-query";

const RateCalender = () => {
    const {data:rooms=[], isPending, error} = useQuery({
        queryKey: ['rooms'],
        queryFn: async () =>{
          const res =await fetch('https://api.bytebeds.com/api/v1/property/1/room/rate-calendar/assessment?start_date=2024-05-01&end_date=2024-05-14');
          return res.json();
        }
    })
    if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message;
  console.log(rooms.data);
    return (
        <div>
           <h2 className="text-3xl font-bold text-center mt-16">Check Out The Rate Calender for Booking Room</h2> 
           <p>Rooms :{rooms?.data?.length}</p>

           
        </div>
    );
};

export default RateCalender;