import {Injectable} from "@angular/core";
import {Http, ConnectionBackend, RequestOptions, Response} from "@angular/http";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {RequestDetails} from "./RequestDetails";

@Injectable()
export class CustomHttp extends Http {

    private readonly requestsSubject: BehaviorSubject<RequestDetails[]> = new BehaviorSubject([]);

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    public get(url: string): Observable<Response> {
        const newRequestDetails: RequestDetails = { description: "GET " + url };
        const existingRequestsDetails = this.requestsSubject.getValue();
        const allDetails = existingRequestsDetails.concat([newRequestDetails]);

        this.requestsSubject.next(allDetails);

        const responseObservable = super.get(url);

        responseObservable.subscribe(
            resp => {
                const ongoingRequests = this.requestsSubject.getValue();
                const ongoingRequestsWithCompletedReqRemoved =
                    ongoingRequests.filter(req => req !== newRequestDetails);
                this.requestsSubject.next(ongoingRequestsWithCompletedReqRemoved);
            },
            err => {
                const ongoingRequests = this.requestsSubject.getValue();
                const ongoingRequestsWithCompletedReqRemoved =
                    ongoingRequests.filter(req => req !== newRequestDetails);
                this.requestsSubject.next(ongoingRequestsWithCompletedReqRemoved);
            });

        return responseObservable;
    }

    public get requestsObservable(): Observable<RequestDetails[]> {
        return this.requestsSubject;
    }
}