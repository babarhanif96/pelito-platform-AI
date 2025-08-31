import { CircularProgress } from "@mui/material"

const Loader = ({title}) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.5)] flex flex-col justify-center items-center">
            <CircularProgress sx={{ color: '#008b8b' }} size={50} />
            <h2 className="text-[#008b8b] pt-[10px] animate-pulse text-[16px]">
                {title}...
            </h2>
        </div>
    )
}

export default Loader