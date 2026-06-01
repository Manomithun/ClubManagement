const allowedTransitions={
    "PENDING":{
        "APPROVED":["SYSTEM_ADMIN"],
        "REJECTED":["SYSTEM_ADMIN"]
    },
    "APPROVED":{
        "ONGOING":["SYSTEM_ADMIN","CLUB_ADMIN"]
    },
    "ONGOING":{
        "COMPLETED":["SYSTEM_ADMIN","CLUB_ADMIN"],
        "CANCELLED":["SYSTEM_ADMIN","CLUB_ADMIN"]
    }
}
export default allowedTransitions;