const UNIVERSITY_DOMAINS = {
    'pilani.bits-pilani.ac.in': 'pilani',
    'hyderabad.bits-pilani.ac.in': 'hyderabad',
    'goa.bits-pilani.ac.in': 'goa'
}


function validateUniversityEmail(email: string) {
    const domain = email.split('@')[1];
    
    const campus = UNIVERSITY_DOMAINS[domain as keyof typeof UNIVERSITY_DOMAINS];
    if(campus) {
        return { isValid: true, campus: campus };
    }
    else{
        return { isValid: false, campus: null };        
    }
}