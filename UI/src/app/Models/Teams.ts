    
     export interface Teams
     {
         odatacontext: string;
         odatacount: number;
         value: Values[];
     }
    
    export interface Values
     {
        id: string;
        createdDateTime?: any;
        displayName: string;
        description: string;
        internalId?: any;
        classification?: any;
        specialization?: any;
        visibility?: any;
        webUrl?: any;
        isArchived: boolean;
        isMembershipLimitedToOwners?: any;
        memberSettings?: any;
        guestSettings?: any;
        messagingSettings?: any;
        funSettings?: any;
        discoverySettings?: any;
    }

   



