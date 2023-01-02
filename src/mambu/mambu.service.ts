import { Injectable } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { BranchResponse } from './interfaces/branch-response.interfaces'
import { JournalEntriesResponse } from './interfaces/journal-response.interfaces'
import { InterestaccrualInterface } from './interfaces/interestaccrual.interfaces'

@Injectable()
export class MambuService {
  async journalEntries(from: string, to: string) {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/vnd.mambu.v2+json',
        'Content-Type': 'application/json',
        apiKey: 'kUwVfSM2kwmoWjzNCZXvkDHoChiaW8eC'
      },
      params: {
        paginationDetails: 'ON',
        from: from,
        to: to
      }
    }

    const { data } = await axios.get<JournalEntriesResponse[]>(
      `${process.env.MAMBU}/gljournalentries`,
      config
    )
    return data
  }

  async interestaccrual(from: string, to: string) {
    const header = {
      Accept: 'application/vnd.mambu.v2+json',
      'Content-Type': 'application/json',
      apiKey: 'kUwVfSM2kwmoWjzNCZXvkDHoChiaW8eC'
    }

    const { data } = await axios.post<InterestaccrualInterface[]>(
      `${process.env.MAMBU}/accounting/interestaccrual:search`,
      {},
      {
        headers: header
      }
    )
    return data
  }

  async branch(idBranch: string) {
    const config: AxiosRequestConfig = {
      headers: {
        Accept: 'application/vnd.mambu.v2+json',
        Authorization: `Basic ${process.env.BASIC_MAMBU}`,
        'Content-Type': 'application/json',
        apiKey: 'kUwVfSM2kwmoWjzNCZXvkDHoChiaW8eC'
      }
    }
    const { data } = await axios.get(
      `${process.env.MAMBU}/branches/${idBranch}`,
      config
    )
    return data.id
  }
}
