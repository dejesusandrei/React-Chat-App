import '../index.css'

export default function Notifications(){
    return(
        <>
            <div className="flex flex-col ">
                <div className="header ">
                    <h1 className="text-[25px] font-roboto font-bold text-black dark:text-white">Notification</h1>
                </div>
                <div className='text-center font-poppins text-[17px] text-black dark:text-zinc-200 mt-4'>
                    No notifications found.
                </div>
            </div>
        </>
    );
}