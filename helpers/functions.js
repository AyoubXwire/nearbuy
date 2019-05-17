const geolib = require('geolib')
module.exports = {
    sortByDistance: location => {
        return (a, b) => {
            const a_distance = geolib.getDistance(location, a.location.coordinates)
            const b_distance = geolib.getDistance(location, b.location.coordinates)
            if (a_distance < b_distance) {
                return -1
            }
            if (a_distance > b_distance) {
                return 1
            }
            return 0
        }
    },
    paginate: (array, pageNumber, pageSize) => {
        return new Promise((resolve, reject) => {
            pageNumber--
            
            const totalPages = Math.ceil(array.length / pageSize)
            const docs = array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
            const currentPage = pageNumber + 1
            const size = pageSize
            const hasNext = currentPage < totalPages
            const hasPrev = currentPage > 1
            const nextPage = currentPage + 1
            const prevPage = currentPage - 1
    
            if(currentPage < 1 || currentPage > totalPages) {
                reject('pageNumber out of boundaries')
            }
            resolve({ docs, totalPages, currentPage, size, hasNext, hasPrev, nextPage, prevPage })
        })
    }
}

