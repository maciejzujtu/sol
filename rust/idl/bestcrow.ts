/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bestcrow.json`.
 */
export type Bestcrow = {
  "address": "EousWVK2cePYb9zvv1oWSca4VNdRQqYef8CsxQ6BL57R",
  "metadata": {
    "name": "bestcrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Milestone crowdfunding escrow for Solana"
  },
  "instructions": [
    {
      "name": "cancelCampaign",
      "discriminator": [
        66,
        10,
        32,
        138,
        122,
        36,
        134,
        202
      ],
      "accounts": [
        {
          "name": "creator",
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "castVote",
      "discriminator": [
        20,
        212,
        15,
        189,
        69,
        180,
        69,
        151
      ],
      "accounts": [
        {
          "name": "wallet",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "backer",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "wallet"
              }
            ]
          }
        },
        {
          "name": "voteReceipt",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "round",
          "type": "u8"
        },
        {
          "name": "approve",
          "type": "bool"
        }
      ]
    },
    {
      "name": "claimRefund",
      "discriminator": [
        15,
        16,
        30,
        161,
        255,
        228,
        97,
        60
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "wallet",
          "writable": true
        },
        {
          "name": "backer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "wallet"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "closeBacker",
      "discriminator": [
        179,
        215,
        44,
        252,
        50,
        239,
        29,
        8
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "wallet",
          "writable": true
        },
        {
          "name": "backer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "wallet"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "closeVoteReceipt",
      "discriminator": [
        245,
        52,
        25,
        255,
        206,
        109,
        60,
        162
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "wallet",
          "writable": true
        },
        {
          "name": "voteReceipt",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "createCampaign",
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "args.campaignId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createCampaignArgs"
            }
          }
        }
      ]
    },
    {
      "name": "expireMilestone",
      "discriminator": [
        63,
        248,
        117,
        14,
        49,
        79,
        240,
        230
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "finalizeFunding",
      "discriminator": [
        129,
        81,
        184,
        191,
        58,
        224,
        149,
        90
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "finalizeVote",
      "discriminator": [
        181,
        176,
        6,
        248,
        249,
        134,
        146,
        56
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "pledge",
      "discriminator": [
        235,
        47,
        156,
        254,
        0,
        88,
        212,
        142
      ],
      "accounts": [
        {
          "name": "wallet",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "backer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "wallet"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "releaseMilestone",
      "discriminator": [
        56,
        2,
        199,
        164,
        184,
        108,
        167,
        222
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "submitEvidence",
      "discriminator": [
        12,
        169,
        228,
        194,
        229,
        31,
        44,
        39
      ],
      "accounts": [
        {
          "name": "creator",
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "evidenceHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "sweepDust",
      "discriminator": [
        9,
        49,
        242,
        88,
        156,
        84,
        109,
        15
      ],
      "accounts": [
        {
          "name": "caller",
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "withdrawPledge",
      "discriminator": [
        87,
        206,
        176,
        206,
        78,
        59,
        5,
        98
      ],
      "accounts": [
        {
          "name": "wallet",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaignId",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "backer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "wallet"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "backer",
      "discriminator": [
        199,
        128,
        179,
        190,
        2,
        66,
        118,
        252
      ]
    },
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "voteReceipt",
      "discriminator": [
        104,
        20,
        204,
        252,
        45,
        84,
        37,
        195
      ]
    }
  ],
  "events": [
    {
      "name": "campaignCreated",
      "discriminator": [
        9,
        98,
        69,
        61,
        53,
        131,
        64,
        152
      ]
    },
    {
      "name": "campaignFinalized",
      "discriminator": [
        219,
        169,
        142,
        66,
        105,
        67,
        124,
        255
      ]
    },
    {
      "name": "contributionChanged",
      "discriminator": [
        113,
        36,
        167,
        65,
        198,
        208,
        190,
        101
      ]
    },
    {
      "name": "evidenceSubmitted",
      "discriminator": [
        13,
        123,
        197,
        44,
        231,
        117,
        168,
        53
      ]
    },
    {
      "name": "fundsMoved",
      "discriminator": [
        45,
        213,
        142,
        27,
        233,
        76,
        210,
        8
      ]
    },
    {
      "name": "milestoneResolved",
      "discriminator": [
        187,
        22,
        126,
        26,
        156,
        84,
        105,
        7
      ]
    },
    {
      "name": "voteRecorded",
      "discriminator": [
        72,
        160,
        49,
        123,
        215,
        219,
        68,
        221
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidTerms",
      "msg": "Invalid campaign terms"
    },
    {
      "code": 6001,
      "name": "invalidCampaignState",
      "msg": "Campaign is not in the required state"
    },
    {
      "code": 6002,
      "name": "invalidMilestoneState",
      "msg": "Milestone is not in the required state"
    },
    {
      "code": 6003,
      "name": "fundingEnded",
      "msg": "Funding period has ended"
    },
    {
      "code": 6004,
      "name": "fundingOpen",
      "msg": "Funding period has not ended"
    },
    {
      "code": 6005,
      "name": "goalExceeded",
      "msg": "Campaign goal would be exceeded"
    },
    {
      "code": 6006,
      "name": "zeroAmount",
      "msg": "Amount must be positive"
    },
    {
      "code": 6007,
      "name": "wrongParticipant",
      "msg": "Wrong creator or backer account"
    },
    {
      "code": 6008,
      "name": "deadlinePassed",
      "msg": "Deadline has passed"
    },
    {
      "code": 6009,
      "name": "deadlineOpen",
      "msg": "Deadline has not passed"
    },
    {
      "code": 6010,
      "name": "wrongRound",
      "msg": "Wrong milestone or voting round"
    },
    {
      "code": 6011,
      "name": "noVotingWeight",
      "msg": "Vote weight is unavailable"
    },
    {
      "code": 6012,
      "name": "arithmetic",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6013,
      "name": "insufficientEscrow",
      "msg": "Escrow balance is insufficient"
    },
    {
      "code": 6014,
      "name": "refundUnavailable",
      "msg": "Refund is not available"
    },
    {
      "code": 6015,
      "name": "alreadyClaimed",
      "msg": "Refund already claimed"
    },
    {
      "code": 6016,
      "name": "refundsOutstanding",
      "msg": "Refunds are still outstanding"
    },
    {
      "code": 6017,
      "name": "emptyEvidence",
      "msg": "Evidence hash must be nonzero"
    },
    {
      "code": 6018,
      "name": "receiptStillNeeded",
      "msg": "Account is still needed for funding, voting, or refund"
    }
  ],
  "types": [
    {
      "name": "backer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "campaignId",
            "type": "u64"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "totalRaised",
            "type": "u64"
          },
          {
            "name": "escrowBalance",
            "type": "u64"
          },
          {
            "name": "totalReleased",
            "type": "u64"
          },
          {
            "name": "initialRelease",
            "type": "u64"
          },
          {
            "name": "refundPool",
            "type": "u64"
          },
          {
            "name": "refundDenominator",
            "type": "u64"
          },
          {
            "name": "refundedAmount",
            "type": "u64"
          },
          {
            "name": "fundingDeadline",
            "type": "i64"
          },
          {
            "name": "votePeriodSecs",
            "type": "i64"
          },
          {
            "name": "metadataHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "currentMilestone",
            "type": "u8"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "campaignStatus"
              }
            }
          },
          {
            "name": "backerCount",
            "type": "u32"
          },
          {
            "name": "refundClaimCount",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "milestones",
            "type": {
              "vec": {
                "defined": {
                  "name": "milestone"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "campaignCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "fundingDeadline",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "campaignFinalized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "succeeded",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "campaignStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "funding"
          },
          {
            "name": "active"
          },
          {
            "name": "failed"
          },
          {
            "name": "terminated"
          },
          {
            "name": "completed"
          }
        ]
      }
    },
    {
      "name": "contributionChanged",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "backer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "withdrawn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "createCampaignArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignId",
            "type": "u64"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "initialRelease",
            "type": "u64"
          },
          {
            "name": "fundingDeadline",
            "type": "i64"
          },
          {
            "name": "votePeriodSecs",
            "type": "i64"
          },
          {
            "name": "metadataHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "milestones",
            "type": {
              "vec": {
                "defined": {
                  "name": "milestoneInput"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "evidenceSubmitted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "milestoneIndex",
            "type": "u8"
          },
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "evidenceHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "fundsMoved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "refund",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "milestone",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "dueAt",
            "type": "i64"
          },
          {
            "name": "evidenceHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "submittedAt",
            "type": "i64"
          },
          {
            "name": "voteDeadline",
            "type": "i64"
          },
          {
            "name": "yesWeight",
            "type": "u64"
          },
          {
            "name": "noWeight",
            "type": "u64"
          },
          {
            "name": "replyDeadline",
            "type": "i64"
          },
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "milestoneStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "milestoneInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "dueAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "milestoneResolved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "milestoneIndex",
            "type": "u8"
          },
          {
            "name": "approved",
            "type": "bool"
          },
          {
            "name": "terminated",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "milestoneStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "voting"
          },
          {
            "name": "revision"
          },
          {
            "name": "showCause"
          },
          {
            "name": "approved"
          },
          {
            "name": "released"
          }
        ]
      }
    },
    {
      "name": "voteReceipt",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "milestoneIndex",
            "type": "u8"
          },
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "approve",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "voteRecorded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "milestoneIndex",
            "type": "u8"
          },
          {
            "name": "round",
            "type": "u8"
          },
          {
            "name": "backer",
            "type": "pubkey"
          },
          {
            "name": "approve",
            "type": "bool"
          },
          {
            "name": "weight",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
