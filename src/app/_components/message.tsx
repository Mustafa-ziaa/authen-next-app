
type props = {
    message: string,
    successfully: boolean,
    showMessage: boolean
}

export function Message({message,successfully,showMessage}: props){
    return (
        <div className={`w-full ${showMessage? 'h-max py-3 border': 'h-0 py-0'} ${successfully? 'bg-red-300/50 border-red-300':'bg-green-300/50 border-green-300'} rounded-lg  flex justify-start items-start  m-auto px-2 mt-1 overflow-hidden transition-all duration-300`}>
        <p className={`text-center text-sm ${successfully? 'text-red-700': 'text-green-700'}`}>{message}</p>
      </div>
    )
}