import { Paziente } from "@/hooks/type";

interface Props {
  paziente: Paziente,
}

const Home: React.FC<Props> = ({ paziente }) => {

  return (
    <div className='w-full grid grid-cols-[repeat(4,_1fr)] grid-rows-[repeat(3,_1fr)] gap-x-[0px] gap-y-[0px]'>
      Home
    </div>
  );
}

export default Home;
