import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsurancePro, InsuranceStatus } from 'src/app/models/InsurancePro';

@Injectable({
  providedIn: 'root'
})
export class InsuranceProService {

  
  private apiUrl = 'http://localhost:8081/Gharbi/api/insurancePros';

  constructor(private http: HttpClient) {}

  getAll(): Observable<InsurancePro[]> {
    return this.http.get<InsurancePro[]>(this.apiUrl);
  }

  getById(id: number): Observable<InsurancePro> {
    return this.http.get<InsurancePro>(`${this.apiUrl}/${id}`);
  }

  create(data: InsurancePro): Observable<InsurancePro> {
    return this.http.post<InsurancePro>(this.apiUrl, data);
  }

  update(data: InsurancePro): Observable<InsurancePro> {
    return this.http.put<InsurancePro>(`${this.apiUrl}`, data);
  }
  createInsurancePro(insurancePro: InsurancePro): Observable<any> {
    const formData = new FormData();
    formData.append('proName', insurancePro.proName);
    formData.append('description', insurancePro.description);
    formData.append('premiumAmount', insurancePro.premiumAmount.toString());
    formData.append('insuranceProType', (insurancePro.insuranceProType?.id?.toString() ?? '0'));
    formData.append('status', insurancePro.status);
  
    if (insurancePro.fichier != null) {
      formData.append('fichier', insurancePro.fichier);
    }
  
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
  
    return this.http.post(`${this.apiUrl}`, formData, { headers: headers });
  }
  
  updateInsurancePro(insurancePro: InsurancePro): Observable<any> {
    const formData = new FormData();
  
    formData.append('id', insurancePro.id?.toString() ?? '');
    formData.append('proName', insurancePro.proName ?? '');
    formData.append('description', insurancePro.description ?? '');
    formData.append('premiumAmount', insurancePro.premiumAmount?.toString() ?? '');
    formData.append('insuranceProType', insurancePro.insuranceProType?.id?.toString() ?? '');
    formData.append('status', insurancePro.status ?? '');
  
    if (insurancePro.fichier) {
      formData.append('fichier', insurancePro.fichier);
    }
  
  
    return this.http.put(`${this.apiUrl}`, formData);
  }
  
  


  createWithFile(formData: FormData): Observable<InsurancePro> {
    return this.http.post<InsurancePro>(this.apiUrl, formData);
  }

  updateWithFile(id: number, formData: FormData): Observable<InsurancePro> {
    return this.http.put<InsurancePro>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  setPrice(data: InsurancePro): Observable<InsurancePro> {
    return this.http.post<InsurancePro>(`${this.apiUrl}/initialize`,data);
  }

  getAllStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  getInsuranceFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/fichier`, {
      responseType: 'blob'
    });
  }

  changeInsuranceStatus(id: number, status: InsuranceStatus): Observable<InsurancePro> {
    return this.http.put<InsurancePro>(`${this.apiUrl}/${id}/status/${status}`, {});
  }
}

